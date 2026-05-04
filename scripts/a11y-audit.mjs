import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const pages = [
  'index.html',
  'o-nas.html',
  'oferta.html',
  'kadra.html',
  'galeria.html',
  'cennik.html',
  'kontakt.html',
  'dostepnosc.html'
];

const port = process.env.PORT || '4173';
const baseUrl = `http://127.0.0.1:${port}`;
const pa11yCliPath = './node_modules/pa11y/bin/pa11y.js';

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { ...options, shell: false });
    let stdout = '';
    let stderr = '';

    if (child.stdout) {
      child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    }

    if (child.stderr) {
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    }

    child.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

const server = spawn(
  'node',
  ['.\\node_modules\\http-server\\bin\\http-server', '-p', port, '-c-1', '--silent'],
  { stdio: 'ignore' }
);

let hasFailures = false;

try {
  await delay(2500);

  for (const page of pages) {
    const target = `${baseUrl}/${page}`;
    const result = await runCommand(process.execPath, [pa11yCliPath, target, '--reporter', 'cli']);

    console.log(`\n=== ${page} ===`);
    if (result.stdout.trim()) {
      console.log(result.stdout.trim());
    }
    if (result.stderr.trim()) {
      console.error(result.stderr.trim());
    }

    if (result.code !== 0) {
      hasFailures = true;
    }
  }
} finally {
  if (!server.killed) {
    server.kill('SIGTERM');
  }
}

if (hasFailures) {
  process.exitCode = 1;
  console.error('\nA11y audit failed.');
} else {
  console.log('\nA11y audit passed for all pages.');
}

/**
 * Accessibility Toolbar
 * Font size controls (A-/A/A+), high contrast toggle
 * Persisted via localStorage, WCAG 2.2 AA compliant
 */
(function () {
  'use strict';

  var FONT_MIN = 14;
  var FONT_MAX = 22;
  var FONT_STEP = 2;
  var FONT_DEFAULT = 16;
  var LS_FONT = 'a11y-font-size';
  var LS_CONTRAST = 'a11y-high-contrast';

  // Build toolbar DOM
  var toolbar = document.createElement('div');
  toolbar.className = 'a11y-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Pasek dostępności');

  var liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'a11y-live';

  toolbar.innerHTML =
    '<div class="a11y-toolbar-inner">' +
      '<span class="a11y-toolbar-group" role="group" aria-label="Rozmiar czcionki">' +
        '<button type="button" class="a11y-btn" id="a11y-font-decrease" aria-label="Zmniejsz czcionkę">A&minus;</button>' +
        '<button type="button" class="a11y-btn" id="a11y-font-reset" aria-label="Domyślny rozmiar czcionki">A</button>' +
        '<button type="button" class="a11y-btn" id="a11y-font-increase" aria-label="Powiększ czcionkę">A+</button>' +
      '</span>' +
      '<button type="button" class="a11y-btn a11y-btn-contrast" id="a11y-contrast-toggle" aria-pressed="false">Wysoki kontrast</button>' +
    '</div>';

  // Insert toolbar after skip link so skip link remains first focusable element
  var skipLink = document.querySelector('.skip-link');
  var insertAfter = (skipLink && skipLink.nextSibling) ? skipLink.nextSibling : document.body.firstChild;
  document.body.insertBefore(liveRegion, insertAfter);
  document.body.insertBefore(toolbar, skipLink ? skipLink.nextSibling : document.body.firstChild);

  // References
  var btnDecrease = document.getElementById('a11y-font-decrease');
  var btnReset = document.getElementById('a11y-font-reset');
  var btnIncrease = document.getElementById('a11y-font-increase');
  var btnContrast = document.getElementById('a11y-contrast-toggle');

  function announce(message) {
    liveRegion.textContent = '';
    setTimeout(function () {
      liveRegion.textContent = message;
    }, 50);
  }

  // ===== Font Size =====
  function getCurrentFontSize() {
    var stored = localStorage.getItem(LS_FONT);
    if (stored) {
      var val = parseInt(stored, 10);
      if (val >= FONT_MIN && val <= FONT_MAX) return val;
    }
    return FONT_DEFAULT;
  }

  function applyFontSize(size) {
    document.documentElement.style.fontSize = size + 'px';
    localStorage.setItem(LS_FONT, size);
    btnDecrease.disabled = size <= FONT_MIN;
    btnIncrease.disabled = size >= FONT_MAX;
  }

  function changeFontSize(delta) {
    var current = getCurrentFontSize();
    var next = Math.max(FONT_MIN, Math.min(FONT_MAX, current + delta));
    applyFontSize(next);
    announce('Rozmiar czcionki: ' + next + ' pikseli');
  }

  btnDecrease.addEventListener('click', function () { changeFontSize(-FONT_STEP); });
  btnReset.addEventListener('click', function () {
    applyFontSize(FONT_DEFAULT);
    announce('Przywrócono domyślny rozmiar czcionki');
  });
  btnIncrease.addEventListener('click', function () { changeFontSize(FONT_STEP); });

  // Apply stored font size on load
  var storedFont = getCurrentFontSize();
  if (storedFont !== FONT_DEFAULT) {
    applyFontSize(storedFont);
  }
  btnDecrease.disabled = storedFont <= FONT_MIN;
  btnIncrease.disabled = storedFont >= FONT_MAX;

  // ===== High Contrast =====
  function isHighContrast() {
    return localStorage.getItem(LS_CONTRAST) === 'true';
  }

  function applyHighContrast(enabled) {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
      btnContrast.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      btnContrast.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem(LS_CONTRAST, enabled);
  }

  btnContrast.addEventListener('click', function () {
    var newState = !isHighContrast();
    applyHighContrast(newState);
    announce(newState ? 'Wysoki kontrast włączony' : 'Wysoki kontrast wyłączony');
  });

  // Apply stored contrast on load
  if (isHighContrast()) {
    applyHighContrast(true);
  }

  // Update header offset to account for toolbar height
  function updateHeaderOffset() {
    var toolbarHeight = toolbar.offsetHeight;
    document.documentElement.style.setProperty('--toolbar-height', toolbarHeight + 'px');
  }
  updateHeaderOffset();
  window.addEventListener('resize', updateHeaderOffset);

})();

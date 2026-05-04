/**
 * Accessible Contact Form Validation + mailto handoff
 * WCAG 2.2 AA compliant: labels, aria-describedby, aria-invalid, role="alert", aria-live
 */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;
  var statusEl = document.getElementById('form-status');
  var recipient = form.getAttribute('data-recipient') || 'Kisielnica@szpital-lomza.pl';
  var subjectInput = document.getElementById('form-subject');
  var phoneInput = document.getElementById('form-phone');

  var fields = [
    {
      input: document.getElementById('form-name'),
      error: document.getElementById('form-name-error'),
      validate: function (val) { return val.trim().length >= 2; }
    },
    {
      input: document.getElementById('form-email'),
      error: document.getElementById('form-email-error'),
      validate: function (val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()); }
    },
    {
      input: document.getElementById('form-subject'),
      error: document.getElementById('form-subject-error'),
      validate: function (val) { return val.trim() !== ''; }
    },
    {
      input: document.getElementById('form-message'),
      error: document.getElementById('form-message-error'),
      validate: function (val) { return val.trim().length >= 10; }
    }
  ];

  function showError(field) {
    field.input.setAttribute('aria-invalid', 'true');
    field.error.classList.add('is-visible');
  }

  function clearError(field) {
    field.input.removeAttribute('aria-invalid');
    field.error.classList.remove('is-visible');
  }

  // Real-time validation on blur
  fields.forEach(function (field) {
    field.input.addEventListener('blur', function () {
      if (field.input.value !== '' || field.input.getAttribute('aria-invalid') === 'true') {
        if (field.validate(field.input.value)) {
          clearError(field);
        } else {
          showError(field);
        }
      }
    });

    // Clear error when user starts typing
    field.input.addEventListener('input', function () {
      if (field.input.getAttribute('aria-invalid') === 'true') {
        if (field.validate(field.input.value)) {
          clearError(field);
        }
      }
    });
  });

  function getSubjectLabel() {
    if (!subjectInput) return 'Wiadomość ze strony';
    if (subjectInput.selectedIndex < 0) return 'Wiadomość ze strony';
    return subjectInput.options[subjectInput.selectedIndex].text || 'Wiadomość ze strony';
  }

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.removeAttribute('hidden');
    statusEl.className = 'form-status ' + (type === 'error' ? 'form-status--error' : 'form-status--success');
    statusEl.textContent = message;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var hasErrors = false;
    var firstInvalid = null;

    fields.forEach(function (field) {
      if (!field.validate(field.input.value)) {
        showError(field);
        hasErrors = true;
        if (!firstInvalid) {
          firstInvalid = field.input;
        }
      } else {
        clearError(field);
      }
    });

    if (hasErrors) {
      firstInvalid.focus();
      return;
    }

    var name = document.getElementById('form-name').value.trim();
    var email = document.getElementById('form-email').value.trim();
    var subject = getSubjectLabel();
    var message = document.getElementById('form-message').value.trim();
    var phone = phoneInput ? phoneInput.value.trim() : '';

    var mailSubject = '[Formularz WWW] ' + subject + ' — ' + name;
    var lines = [
      'Imię i nazwisko: ' + name,
      'Adres e-mail: ' + email,
      'Telefon: ' + (phone || 'nie podano'),
      'Temat: ' + subject,
      '',
      'Wiadomość:',
      message
    ];

    var mailtoUrl =
      'mailto:' + recipient +
      '?subject=' + encodeURIComponent(mailSubject) +
      '&body=' + encodeURIComponent(lines.join('\n'));

    showStatus(
      'success',
      'Przygotowaliśmy wiadomość w Twoim programie pocztowym. Jeśli okno się nie otworzyło, napisz bezpośrednio na ' + recipient + '.'
    );

    // Use a short timeout so screen readers can announce status before focus leaves the page.
    setTimeout(function () {
      window.location.href = mailtoUrl;
    }, 120);
  });
})();

/**
 * Main JS — Mobile menu, smooth scroll, sticky header
 */
(function () {
  'use strict';

  // ===== Mobile Menu =====
  const menuToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const menuLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
  let lastFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    mobileNav.removeAttribute('hidden');
    // Focus first link
    if (menuLinks.length > 0) {
      menuLinks[0].focus();
    }
    document.addEventListener('keydown', trapMenuFocus);
  }

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('hidden', '');
    document.removeEventListener('keydown', trapMenuFocus);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function trapMenuFocus(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    if (e.key !== 'Tab') return;

    var focusableElements = mobileNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    var allFocusable = [menuToggle];
    for (var i = 0; i < focusableElements.length; i++) {
      allFocusable.push(focusableElements[i]);
    }
    var firstEl = allFocusable[0];
    var lastEl = allFocusable[allFocusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu only when the full desktop navigation replaces the mobile menu.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1180 && mobileNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // ===== Smooth Scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  });

  // ===== Update scroll-padding-top based on header height =====
  function updateScrollPadding() {
    var header = document.querySelector('.site-header');
    var toolbar = document.querySelector('.a11y-toolbar');
    var toolbarHeight = toolbar ? toolbar.offsetHeight : 0;
    if (header) {
      document.documentElement.style.scrollPaddingTop = (header.offsetHeight + toolbarHeight) + 'px';
    }
  }
  updateScrollPadding();
  window.addEventListener('resize', updateScrollPadding);

})();

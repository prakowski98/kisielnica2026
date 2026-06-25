/**
 * Accessible Lightbox Gallery
 * WCAG 2.2 AA: native <button> triggers, aria-labelledby, inert background, focus trap
 */
(function () {
  'use strict';

  var galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  var overlay = null;
  var currentIndex = 0;
  var lastFocusedElement = null;

  // Elements to mark inert when lightbox is open
  function getBackgroundElements() {
    return document.querySelectorAll('header, main, footer, .a11y-toolbar, .mobile-nav');
  }

  function setBackgroundInert(inert) {
    getBackgroundElements().forEach(function (el) {
      if (inert) {
        el.setAttribute('inert', '');
      } else {
        el.removeAttribute('inert');
      }
    });
  }

  // Build lightbox DOM
  function createLightbox() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'lightbox-title');
    overlay.setAttribute('hidden', '');

    overlay.innerHTML =
      '<div class="lightbox-content">' +
        '<h2 id="lightbox-title" class="sr-only"></h2>' +
        '<button class="lightbox-close" aria-label="Zamknij galerię">&times;</button>' +
        '<button class="lightbox-prev" aria-label="Poprzedni materiał">&#8249;</button>' +
        '<div class="lightbox-img-wrap">' +
          '<img class="lightbox-img" src="" alt="" />' +
          '<video class="lightbox-video" controls playsinline preload="metadata" hidden></video>' +
        '</div>' +
        '<button class="lightbox-next" aria-label="Następny materiał">&#8250;</button>' +
        '<div class="lightbox-counter" aria-live="polite" role="status"></div>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    overlay.querySelector('.lightbox-prev').addEventListener('click', showPrev);
    overlay.querySelector('.lightbox-next').addEventListener('click', showNext);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });
  }

  function openLightbox(index) {
    if (!overlay) createLightbox();
    lastFocusedElement = document.activeElement;
    currentIndex = index;
    updateMedia();
    overlay.removeAttribute('hidden');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setBackgroundInert(true);
    overlay.querySelector('.lightbox-close').focus();
    document.addEventListener('keydown', handleLightboxKeys);
  }

  function closeLightbox() {
    stopVideo();
    overlay.setAttribute('hidden', '');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setBackgroundInert(false);
    document.removeEventListener('keydown', handleLightboxKeys);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function stopVideo() {
    if (!overlay) return;
    var video = overlay.querySelector('.lightbox-video');
    if (!video) return;
    video.pause();
    video.removeAttribute('src');
    video.load();
  }

  function getItemTitle(item) {
    var imgEl = item.querySelector('img');
    return item.getAttribute('data-title') ||
      (imgEl ? imgEl.alt : '') ||
      item.textContent.trim() ||
      'Materiał z galerii';
  }

  function updateMedia() {
    var item = galleryItems[currentIndex];
    var img = overlay.querySelector('.lightbox-img');
    var video = overlay.querySelector('.lightbox-video');
    var isVideo = item.getAttribute('data-type') === 'video';
    var previewImg = item.querySelector('img');
    var previewVideo = item.querySelector('video');
    var fullSrc = item.getAttribute('data-full') ||
      (previewImg ? previewImg.src : '') ||
      (previewVideo ? previewVideo.currentSrc || previewVideo.src : '');
    var titleText = getItemTitle(item);

    stopVideo();

    if (isVideo) {
      img.setAttribute('hidden', '');
      img.removeAttribute('src');
      img.alt = '';
      video.removeAttribute('hidden');
      video.src = fullSrc;
      video.load();
    } else {
      video.setAttribute('hidden', '');
      img.removeAttribute('hidden');
      img.src = fullSrc;
      img.alt = titleText;
    }

    // Update dialog heading for screen readers
    var title = overlay.querySelector('#lightbox-title');
    title.textContent = titleText;

    overlay.querySelector('.lightbox-counter').textContent =
      'Materiał ' + (currentIndex + 1) + ' z ' + galleryItems.length;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateMedia();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateMedia();
  }

  function handleLightboxKeys(e) {
    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key === 'ArrowLeft') {
      showPrev();
      return;
    }
    if (e.key === 'ArrowRight') {
      showNext();
      return;
    }

    // Focus trap
    if (e.key === 'Tab') {
      var focusable = overlay.querySelectorAll('button:not([hidden]), video[controls]:not([hidden])');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  // Set aria-label on native <button> gallery items
  galleryItems.forEach(function (item, index) {
    var isVideo = item.getAttribute('data-type') === 'video';
    var titleText = getItemTitle(item);
    item.setAttribute('aria-label', (isVideo ? 'Odtwórz film: ' : 'Powiększ: ') + titleText);

    item.addEventListener('click', function () {
      openLightbox(index);
    });
  });

})();

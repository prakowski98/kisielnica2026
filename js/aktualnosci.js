(function () {
  'use strict';

  var feed = document.getElementById('aktualnosci-feed');
  if (!feed) return;
  if (typeof AKTUALNOSCI === 'undefined' || AKTUALNOSCI.length === 0) {
    feed.innerHTML = '<p class="news-empty">Brak aktualności. Zajrzyj wkrótce!</p>';
    return;
  }

  var MIESIAC = [
    'stycznia','lutego','marca','kwietnia','maja','czerwca',
    'lipca','sierpnia','września','października','listopada','grudnia'
  ];

  function formatujDate(iso) {
    var p = iso.split('-');
    var d = parseInt(p[2], 10);
    var m = parseInt(p[1], 10) - 1;
    return d + ' ' + MIESIAC[m] + ' ' + p[0];
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatujTresc(tresc) {
    return escapeHTML(tresc)
      .split('\n\n')
      .map(function (akapit) {
        return '<p>' + akapit.replace(/\n/g, '<br>') + '</p>';
      })
      .join('');
  }

  var html = AKTUALNOSCI.map(function (wpis) {
    var tytul = wpis.tytul
      ? '<h2 class="news-card-title">' + escapeHTML(wpis.tytul) + '</h2>'
      : '';

    var zdjecie = '';
    if (wpis.zdjecie) {
      zdjecie =
        '<figure class="news-card-figure">' +
          '<img src="' + escapeHTML(wpis.zdjecie) + '" alt="' + escapeHTML(wpis.zdjecieOpis || '') + '" loading="lazy" decoding="async">' +
          (wpis.zdjecieOpis ? '<figcaption>' + escapeHTML(wpis.zdjecieOpis) + '</figcaption>' : '') +
        '</figure>';
    }

    var dataFormatted = formatujDate(wpis.data);

    return (
      '<article class="news-card">' +
        '<header class="news-card-header">' +
          '<div class="news-card-meta">' +
            '<img src="img/logo.png" alt="" aria-hidden="true" class="news-card-avatar" width="44" height="44">' +
            '<div>' +
              '<span class="news-card-author">Ośrodek Kisielnica</span>' +
              '<time class="news-card-date" datetime="' + escapeHTML(wpis.data) + '">' + dataFormatted + '</time>' +
            '</div>' +
          '</div>' +
        '</header>' +
        '<div class="news-card-body">' +
          tytul +
          '<div class="news-card-content">' + formatujTresc(wpis.tresc) + '</div>' +
          zdjecie +
        '</div>' +
      '</article>'
    );
  }).join('');

  feed.innerHTML = html;
})();

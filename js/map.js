/**
 * Leaflet Map Initialization for Kontakt page
 */
(function () {
  'use strict';

  var mapContainer = document.getElementById('map');
  if (!mapContainer || typeof L === 'undefined') return;

  var lat = 53.193;
  var lng = 22.089;

  var map = L.map('map', {
    center: [lat, lng],
    zoom: 14,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);

  L.marker([lat, lng], {
    keyboard: false,
    interactive: false,
    alt: 'Lokalizacja Ośrodka Jeździectwa i Rehabilitacji Konnej w Kisielnicy'
  })
    .addTo(map)
    .bindTooltip(
      '<strong>Ośrodek Jeździectwa i Rehabilitacji Konnej</strong><br>Kisielnica 97, 18-421 Piątnica Poduchowna',
      {
        permanent: true,
        direction: 'top',
        offset: [0, -16],
        className: 'map-tooltip'
      }
    );

})();

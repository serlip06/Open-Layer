import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import Feature from 'https://cdn.skypack.dev/ol/Feature.js';
import Point from 'https://cdn.skypack.dev/ol/geom/Point.js';
import { fromLonLat, toLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { Icon, Style } from 'https://cdn.skypack.dev/ol/style.js';
import { showPopup } from './popup.js'; // Mengimpor fungsi showPopup dari popup.js

// Sumber data untuk marker
const markerSource = new VectorSource();

// Layer untuk marker
const markerLayer = new VectorLayer({
  source: markerSource,
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({ source: new OSM() }),
    markerLayer,
  ],
  view: new View({
    center: fromLonLat([107.9019822944495, -7.215907720160664]),
    zoom: 12,
  }),
});

const savedLocations = [];
let currentCoordinate = null;

// Tambahkan event listener untuk klik pada peta
map.on('click', async (event) => {
  currentCoordinate = event.coordinate;
  const lonLat = toLonLat(currentCoordinate);

  // Ambil nama lokasi menggunakan API reverse geocoding
  const locationName = await getLocationName(lonLat[1], lonLat[0]);

  // Tambahkan marker pada lokasi yang diklik
  addMarker(currentCoordinate, locationName);

  // Tampilkan popup dengan informasi lokasi
  const message = `Longitude: ${lonLat[0].toFixed(6)}, Latitude: ${lonLat[1].toFixed(6)}\nLocation: ${locationName}`;
  showPopup('Location Information', message);

  // Simpan lokasi
  savedLocations.push({
    longitude: lonLat[0].toFixed(6),
    latitude: lonLat[1].toFixed(6),
    description: locationName,
  });
  updateLocationList();
});

// Fungsi untuk mendapatkan nama lokasi menggunakan API reverse geocoding
async function getLocationName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.display_name || 'Location not found';
  } catch (error) {
    console.error('Error fetching location name:', error);
    return 'Location not found';
  }
}

// Fungsi untuk menambahkan marker pada peta
function addMarker(coordinate, description) {
  const marker = new Feature({
    geometry: new Point(coordinate),
  });
  marker.setStyle(
    new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        scale: 0.05,
      }),
    })
  );
  markerSource.addFeature(marker);
}

// Update daftar lokasi
function updateLocationList() {
  const locationList = document.getElementById('location-list');
  locationList.innerHTML = '';
  savedLocations.forEach((location, index) => {
    const li = document.createElement('li');
    li.textContent = `Location ${index + 1}: Longitude ${location.longitude}, Latitude ${location.latitude}, Description: ${location.description}`;
    locationList.appendChild(li);
  });
}

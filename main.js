/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup().addTo(map),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  zones: L.featureGroup().addTo(map),
  hotels: L.featureGroup().addTo(map),
}

// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "Esri.WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
    "Touristische Kraftfahrlinien Liniennetz Vienna Sightseeing Linie Wien ": themaLayer.lines,
    "Touristische Kraftfahrlinien Haltestellen Vienna Sightseeing Linie Standorte Wien ": themaLayer.stops,
    "Fußgängerzonen Wien ": themaLayer.zones,
    "Hotels und Unterkünfte Standorte Wien ": themaLayer.hotels,
  })
  .addTo(map);

// Marker Stephansdom
// L.marker([stephansdom.lat, stephansdom.lng])
//   .addTo(themaLayer.sights)
//   .bindPopup(stephansdom.title)
//   .openPopup();

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

// Fullscreen
L.control
  .fullscreen()
  .addTo(map);

// funktion
async function loadSights(url) {
  console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <img src="${feature.properties.THUMBNAIL}" alt ="*">
      <h4><a href= "${feature.properties.WEITERE_INF}" 
      target="wien"> ${feature.properties.NAME}</a> </h4>
      <adress>${feature.properties.ADRESSE}</adress>
      `);
    }
  }).addTo(themaLayer.sights);
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");

// funktion LINES
async function loadLines(url) {
  console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <h4> <i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
      <br> <i class="fa-regular fa-circle-stop"></i> ${feature.properties.FROM_NAME}
      <br> <i class="fa-solid fa-arrow-down"></i>
      <br> <i class="fa-regular fa-circle-stop"></i> ${feature.properties.TO_NAME}
      `);
    }
  }).addTo(themaLayer.lines);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");


// funktion STOPS
async function loadStops(url) {
  console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
      <br> ${feature.properties.STAT_ID} ${feature.properties.STAT_NAME}
      `);
    }
  }).addTo(themaLayer.stops);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");


// funktion ZONES
async function loadZones(url) {
  console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <h4> Fußgängerzone ${feature.properties.ADRESSE}" </h4>
      <br> <i class="fa-regular fa-clock"></i> ${feature.properties.ZEITRAUM}
      <br>
      <br> <i class="fa-solid fa-circle-exclamation"></i> ${feature.properties.AUSN_TEXT}
      `);
    }
  }).addTo(themaLayer.zones);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");


// funktion HOTELS
async function loadHotels(url) {
  console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
      layer.bindPopup(`
      <h4>${feature.properties.BETRIEB}</h4>
      <br> <strong> ${feature.properties.BETRIEBSART_TXT} ${feature.properties.KATEGORIE_TXT} </strong>
      <br>_________________________________
      <br> Addr.: ${feature.properties.ADRESSE}
      <br> Tel.: ${feature.properties.KONTAKT_TEL}
      <br><a href ="${feature.properties.KONTAKT_EMAIL}" target = "wien"> ${feature.properties.KONTAKT_EMAIL} </a>
      <br> <a href= "${feature.properties.WEBLINK1}" target ="wien"> Homepage </a>
     `);
    }
  }).addTo(themaLayer.hotels);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json");


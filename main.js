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

const ART_DATA = '/2024-arts-datathon/data/civic-art-data.csv';
const mapDiv = document.querySelector('#map');
const map = L.map(mapDiv).setView([34.0622, -118.2437], 10);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 0
}).addTo(map);

function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            download: true,
            header: true,
            complete: function(results) {
                resolve(results.data);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function createMarkers(data) {
    let markerLayer = L.layerGroup();

    data.forEach(item => {
        let marker = L.marker([item.Latitude, item.Longitude]);
        console.log(item)
        marker.addTo(markerLayer);
        marker.bindPopup(`<b>${item["Title"]}</b><br>By: ${item.ArtistName}<br>Medium: ${item.Medium}<br><br>${item["Location Name"]}<br>${item.AddressStreet}<br>${item.AddressCity}`).openPopup();
    });
    map.addLayer(markerLayer);
}

Promise.all([parseCSV(ART_DATA)])
    .then(results => {        
        let artworks = results[0];
        console.log('Parsed ' + artworks.length + ' artworks');

        let filteredArtworks = artworks.filter(function(row) {
            return row.Latitude != null && row.Longitude != null && row.Show === "TRUE";
        });
        console.log('Filtered ' + filteredArtworks.length + ' artworks');
        
        createMarkers(filteredArtworks);
    })
    .catch(err => console.error(err));
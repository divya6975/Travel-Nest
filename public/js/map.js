/*const map = L.map('map').setView([28.6139, 77.209],9);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
                attribution: '&copy; openstreetmap contributors'
            }).addTo(map);

            L.marker([28.6139, 77.209])
                   .addTo(map)
                   .bindPopup("Delhi")
                   .openPopup();*/


const mapElement = document.getElementById("map");

if (mapElement) {
    const lat = mapElement.dataset.lat;
    const lng = mapElement.dataset.lng;

    const map = L.map("map").setView([lat, lng], 9);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup("<h6>Exact location Provided after booking</h6>")
        .openPopup();
}                   
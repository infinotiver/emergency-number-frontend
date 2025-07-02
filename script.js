navigator.geolocation.getCurrentPosition(success, error);
const countryLabel = document.getElementById('country-label');
function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    reverseGeocode(lat, lon);
}

function error(err) {
    countryLabel.innerHTML = "<h2>Something went wrong</h2><p>Try reloading the website</p>";
}

async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();

    const country = data.address.country;
    const country_code = data.address.country_code;
    countryLabel.innerHTML = `<h2>You're in <span class ="country-name">${country}</span></h2>`;
    searchByCountry(country_code);
}

let emergencyData = [];

fetch("https://raw.githubusercontent.com/infinotiver/emergency-number-api/refs/heads/main/data/data.json")
    .then(res => res.json())
    .then(data => {
        emergencyData = data;
    });

function searchByCountry(countryCode) {
    const results = emergencyData[countryCode.toUpperCase()];
    renderResults(results);
}

function renderResults(data) {
    const resultsDiv = document.getElementById('result');
    resultsDiv.innerHTML = "";
    const police = `
    <div class="card">
      <div class="card-icon"><i class="fa-solid fa-shield-halved"></i></div>
      <div class="card-title">Police</div>
      <div class="card-number">${data.police}</div>
    </div>
    `;

    const ambulance = `
    <div class="card">
      <div class="card-icon"><i class="fa-solid fa-kit-medical"></i></div>
      <div class="card-title">Ambulance</div>
      <div class="card-number">${data.ambulance}</div>
    </div>
    `;

    const fire = `
    <div class="card">
      <div class="card-icon"><<i class="fa-solid fa-fire-extinguisher"></i></div>
      <div class="card-title">Fire</div>
      <div class="card-number">${data.fire}</div>
    </div>
    `;
    const notes = `
    <p>${data.notes}</p>`;

    resultsDiv.innerHTML = police + ambulance + fire + notes;
}

let mapInitialized = false;

document.getElementById("change-location").addEventListener("click", () => {
    const mapWrap = document.getElementById("map-container");
    mapWrap.style.display = "block";

    if (!mapInitialized) {
        initMap();
        mapInitialized = true;
    }
});

function initMap() {
    const map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', async function (e) {
        const { lat, lng } = e.latlng;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        const country = data.address?.country;

        if (country) {
            const mapWrap = document.getElementById("map-container");
            mapWrap.style.display = "none";

            const countryCode = data.address.country_code;
            if (countryCode) {
                countryLabel.innerHTML = `<h2>You selected <span class="country-name">${country}</span></h2>`;
                searchByCountry(countryCode);
            } else {
                alert("Could not detect country code");
            }
        } else {
            alert("Could not detect country");
        }
    });
}
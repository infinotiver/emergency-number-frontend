navigator.geolocation.getCurrentPosition(success, error);
const countryLabel = document.getElementById('country-label');
function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    // reverse geocode this
    reverseGeocode(lat, lon);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();

    const country = data.address.country;
    const country_code = data.address.country_code;
    console.log("You are in:", country);
    console.log("Country code:", country_code)
    countryLabel.innerHTML = `<h2>You're in <span class ="country-name">${country}</span></h2>`;
    searchByCountry(country_code);
}

let emergencyData = [];

fetch("https://raw.githubusercontent.com/infinotiver/emergency-number-api/refs/heads/main/data/data.json")
    .then(res => res.json())
    .then(data => {
        emergencyData = data;
        console.log("Data stored globally:", emergencyData);
    });


function searchByCountry(countryCode) {
    console.log(emergencyData);
    const results = emergencyData[countryCode.toUpperCase()];
    console.log(results);
    renderResults(results)
}
function renderResults(data) {
    const resultsDiv = document.getElementById('result');
    resultsDiv.innerHTML = "";
    const police = `
    <div class="card">
      <div class="card-title">Police</div>
      <div class="card-number">${data.police}</div>
    </div>
    `;

    const ambulance = `
    <div class="card">
      <div class="card-title">Ambulance</div>
      <div class="card-number">${data.ambulance}</div>
    </div>
    `;

    const fire = `
    <div class="card">
      <div class="card-title">Fire</div>
      <div class="card-number">${data.fire}</div>
    </div>
    `;
    const notes = `
    <p>${data.notes}</p>`

    resultsDiv.innerHTML = police + ambulance + fire + notes;
}

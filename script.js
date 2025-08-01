const apiKey = "295ed20c0ca447ec8c3152319250108";
let isCelsius = true;

async function getWeather(city = null) {
  const locationInput = document.getElementById("locationInput");
  const weatherDisplay = document.getElementById("weatherDisplay");
  const appContainer = document.getElementById("appContainer");

  const location = city || locationInput.value.trim();
  if (!location) {
    weatherDisplay.innerHTML = "<p>Please enter a location.</p>";
    return;
  }

  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`
    );

    if (!response.ok) throw new Error("Location not found");

    const data = await response.json();
    const condition = data.current.condition.text.toLowerCase();
    const backgroundImage = getBackgroundImage(condition);

    if (backgroundImage) {
      appContainer.style.backgroundImage = `url('${backgroundImage}')`;
    }

    weatherDisplay.innerHTML = `
      <h2>${data.location.name}, ${data.location.country}</h2>
      <p><strong>Condition:</strong> ${data.current.condition.text}</p>
      <img src="https:${data.current.condition.icon}" alt="Weather Icon">
      <p><strong>Temperature:</strong> ${data.current.temp_c} °C / ${data.current.temp_f} °F</p>
      <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.current.wind_kph} km/h</p>
      <p><strong>Air Quality:</strong> ${getAQ(data.current.air_quality)}</p>
    `;
  } catch (error) {
    weatherDisplay.innerHTML = `<p style="color: #ff6b6b;">${error.message}</p>`;
  }
}

function getBackgroundImage(condition) {
  if (condition.includes("sunny") || condition.includes("clear")) {
    return "images/sunny.jpg";
  } else if (condition.includes("cloud")) {
    return "images/cloudy.jpg";
  } else if (condition.includes("rain")) {
    return "images/rainy.jpg";
  } else if (condition.includes("snow")) {
    return "images/snow.jpg";
  } else if (condition.includes("thunder")) {
    return "images/thunder.jpg";
  } else {
    return ""; // No default
  }
}

function toggleUnit() {
  alert("Temperature is shown in both °C and °F!");
}

function presetCity(cityName) {
  document.getElementById("locationInput").value = cityName;
  getWeather(cityName);
}

function getAQ(aq) {
  if (!aq) return "N/A";
  return `PM2.5: ${aq.pm2_5.toFixed(1)}, PM10: ${aq.pm10.toFixed(1)}, CO: ${aq.co.toFixed(1)}`;
}

function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById("clock");
  clockEl.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

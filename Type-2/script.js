const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "263ad5dfb05e13682538cfc54600532d";

const createWeatherCard = (cityName, weatherItem, isCurrent) => {
  const { dt_txt, main, wind, weather } = weatherItem;
  const date = dt_txt.split(" ")[0];
  const temp = (main.temp - 273.15).toFixed(2);
  const { speed } = wind;
  const { icon, description } = weather[0];

  if (isCurrent) {
    return `
      <div class="details">
        <h2>${cityName} (${date})</h2>
        <h6>Temperature: ${temp}°C</h6>
        <h6>Wind: ${speed} M/S</h6>
        <h6>Humidity: ${main.humidity}%</h6>
      </div>
      <div class="icon">
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon">
        <h6>${description}</h6>
      </div>`;
  }

  return `
    <li class="card">
      <h3>(${date})</h3>
      <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon">
      <h6>Temp: ${temp}°C</h6>
      <h6>Wind: ${speed} M/S</h6>
      <h6>Humidity: ${main.humidity}%</h6>
    </li>`;
};

const fetchWeatherDetails = async (cityName, latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    const data = await response.json();
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      return (
        !uniqueForecastDays.includes(forecastDate) &&
        uniqueForecastDays.push(forecastDate)
      );
    });

    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";

    fiveDaysForecast.forEach((weatherItem, index) => {
      const html = createWeatherCard(cityName, weatherItem, index === 0);
      index === 0
        ? currentWeatherDiv.insertAdjacentHTML("beforeend", html)
        : weatherCardsDiv.insertAdjacentHTML("beforeend", html);
    });
  } catch {
    alert("An error occurred while fetching the weather forecast!");
  }
};

const fetchCityCoordinates = async () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    );
    const data = await response.json();
    if (!data.length) return alert(`No coordinates found for ${cityName}`);
    const { lat, lon, name } = data[0];
    fetchWeatherDetails(name, lat, lon);
  } catch {
    alert("An error occurred while fetching the coordinates!");
  }
};

const fetchUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();
        fetchWeatherDetails(data[0].name, latitude, longitude);
      } catch {
        alert("An error occurred while fetching the city name!");
      }
    },
    (error) => {
      alert(
        error.code === error.PERMISSION_DENIED
          ? "Geolocation request denied. Please reset location permission to grant access again."
          : "Geolocation request error. Please reset location permission."
      );
    }
  );
};

locationButton.addEventListener("click", fetchUserCoordinates);
searchButton.addEventListener("click", fetchCityCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && fetchCityCoordinates()
);

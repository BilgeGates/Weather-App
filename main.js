// !  Weather Api and key

const apiKey = "263ad5dfb05e13682538cfc54600532d";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const icon = document.querySelector(".icon");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();
    console.log(data);
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " " + "km/h";

    if (data.weather[0].main == "Clouds") {
      icon.src = "img/clouds.png";
      document.querySelector(".desc").innerHTML = data.weather[0].description;
    } else if (data.weather[0].main == "Clear") {
      icon.src = "img/clear.png";
      document.querySelector(".desc").innerHTML = data.weather[0].description;
    } else if (data.weather[0].main == "Rain") {
      icon.src = "img/rain.png";
      document.querySelector(".desc").innerHTML = data.weather[0].description;
    } else if (data.weather[0].main == "Drizzle") {
      icon.src = "img/drizzle.png";
      document.querySelector(".desc").innerHTML = data.weather[0].description;
    } else if (data.weather[0].main == "Mist") {
      icon.src = "img/mist.png";
      document.querySelector(".desc").innerHTML = data.weather[0].description;
    } else if (data.weather[0].main == "Snow") {
      icon.src = "img/snow.png";
      document.querySelector(".desc").innerHTML = data.weather[0].description;
    } else if (data.weather[0].main == "Thunderstorm") {
      icon.src = "img/thunderstorm.jpg";
      document.querySelector(".desc").innerHTML = data.weather[0].description;
    }
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

const getCityName = (e) => {
  if (e.keyCode == "13") {
    checkWeather(searchBox.value);
  }
};

searchBox.addEventListener("keydown", getCityName);

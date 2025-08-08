function refreshweather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  let date = new Date(response.data.dt * 1000);
  let temperature = response.data.main.temp;
  let city = response.data.name;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let iconCode = response.data.weather[0].icon;

  cityElement.innerHTML = city;
  humidityElement.innerHTML = `${humidity}%`;
  windSpeedElement.innerHTML = `${windSpeed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  timeElement.innerHTML = `${formateDate(date)}, ${description}`;
  iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" class="weather-app-icon" />`;

  getForecast(response.data.name);
}

function formateDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "ff6e78b219e243b3f72eaf0251bd1e56";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshweather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = searchInput.value;
  searchCity(searchInput.value);
}

function getForecast(city) {
  let apiKey = "ff6e78b219e243b3f72eaf0251bd1e56";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data);

  let forecastHtml = "";

  response.data.list.slice(0, 5).forEach(function (forecast) {
    let date = new Date(forecast.dt * 1000);
    let options = { weekday: "short" };
    let dayName = date.toLocaleDateString("en-US", options);

    forecastHtml += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        
          <img src="https://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png" class="weather-forecast-icon" />
       
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(forecast.main.temp_max)}º</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            forecast.main.temp_min
          )}º</div>
        </div>
      </div>
    `;
  });

  document.querySelector("#forecast").innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Paris");

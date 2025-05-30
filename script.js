const cityInput = document.querySelector(".input-box");
const searchBtn = document.querySelector(".search-icon");

const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const locationName = document.querySelector(".location-name");
const tempInfo = document.querySelector(".temp-info");
const condition = document.querySelector(".condition");
const humidityValue = document.querySelector(".humidity-value");
const windValue = document.querySelector(".wind-value");
const currentDate = document.querySelector(".current-date");
const weatherSummaryImg = document.querySelector(".weather-summary-img");

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

const apiKey = "36cc154cce15ea9e3f253f0966c6f7a8";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function fetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await fetchData("weather", city);

  if (weatherData.cod != 200) {
    showSection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  locationName.textContent = country;
  tempInfo.textContent = Math.round(temp) + " ℃";
  condition.textContent = main;
  humidityValue.textContent = humidity + " %";
  windValue.textContent = speed + " M/s";

  currentDate.textContent = getCurrentDate();

  weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

  await updateForecastInfo(city);
  showSection(weatherInfoSection);
}

async function updateForecastInfo(city) {
  const forecastData = await fetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-GB", dateOption);

  const forecastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img
              src="assets/weather/${getWeatherIcon(id)}"
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
          </div>`;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showSection(section) {
  [weatherInfoSection, notFoundSection, searchCitySection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}

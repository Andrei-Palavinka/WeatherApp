import { apiRequest } from "./api.js";
import { addResentlyItem, showResentlyItem } from "./resentlyListData.js";

const headerLogo = document.querySelector(".header__logo");
const currentWeatherIcon = document.querySelector(".current-weather-icon");
const todayTemperature = document.getElementById("today-temperature");
const todayDescription = document.getElementById("today-description");
const humidity = document.querySelector(".weather__humidity");
const weatherDate = document.querySelector(".weather__date");
const presssure = document.querySelector(".weather__pressure");
const feelsLike = document.querySelector(".weather__feels_like");
const pollution = document.querySelector(".weather__pollution");

export const currentWeatherData = async (weatherData, key) => {
  let API_URL;
  if (weatherData.lat && weatherData.lon) {
    API_URL = `weather?lat=${weatherData.lat}&lon=${weatherData.lon}&appid=${key}&units=metric`;
  } else {
    API_URL = `weather?q=${weatherData}&appid=${key}&units=metric`;
  }

  const data = await apiRequest(API_URL);
  getPolutionData(data.coord, key);
  showCurrentCity(data.name, data.sys.country);
  showMainTemp(data);
  const itemResently = {
    id: data.id,
    city: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
    src: `/img/animated/${data.weather[0].icon}.svg`,
  };
  addResentlyItem(itemResently);
  showResentlyItem();
  return data;
};

const getPolutionData = async (weatherData, key) => {
  const API_URL = `air_pollution?lat=${weatherData.lat}&lon=${weatherData.lon}&appid=${key}`;

  const data = await apiRequest(API_URL);
  showPolution(data.list[0].main.aqi);
};

const showCurrentCity = (city, country) => {
  const headerCity = document.querySelector(".header__city");
  if (headerCity) {
    headerCity.remove();
  }

  const cityInfo = document.createElement("div");
  cityInfo.classList.add("header__city__info");

  const divCity = document.createElement("div");
  divCity.classList.add("header__city");
  divCity.textContent = city + ", " + country;

  headerLogo.insertAdjacentElement("afterend", divCity);
};

const showMainTemp = (data) => {
  const date = new Date();

  const temperature = data.main.temp;
  const description = data.weather[0].description;
  humidity.textContent = `Влажность: ${data.main.humidity}%`;
  presssure.textContent = `Давление: ${data.main.pressure} гПа`;
  feelsLike.textContent = `Ощущается: ${Math.round(data.main.feels_like)}°C`;
  currentWeatherIcon.src = `/img/animated/${data.weather[0].icon}.svg`;
  todayTemperature.textContent = `Температура: ${Math.round(temperature)}°C`;
  todayDescription.textContent = `Облачность: ${description}`;
  weatherDate.textContent = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    weekday: "long",
  });
};

const showPolution = (data) => {
  const dataMap = {
    1: "низкое",
    2: "низкое",
    3: "низкое",
    4: "среднее",
    5: "среднее",
    6: "среднее",
    7: "высокое",
    8: "высокое",
    9: "высокое",
    10: "очень высокое",
  };

  pollution.textContent = `Загрязнение воздуха: ${dataMap[data]}`;
};

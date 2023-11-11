import { apiRequest } from "./api.js";
import { getIconForecast, getMediumTemp } from "./helpers.js";

export const weatherForecastData = async (weatherData, key) => {
  let API_URL;
  if (weatherData.lat && weatherData.lon) {
    API_URL = `forecast?lat=${weatherData.lat}&lon=${weatherData.lon}&appid=${key}&units=metric`;
  } else {
    API_URL = `forecast?q=${weatherData}&appid=${key}&units=metric`;
  }

  try {
    const data = await apiRequest(API_URL);

    renderForecastList(data.list);
    renderWeatherHours(data.list.slice(0, 5));
  } catch (error) {
    console.error("Error fetching weather forecast data:", error);
  }
};

const renderForecastList = (list) => {
  const forecastList = document.getElementById("forecast-list");
  forecastList.innerHTML = "";

  let currentDate = null;
  let dailyTemperatures = { day: [], night: [], forecastDayIcon: [] };
  let arrAllDayTemp = [];
  let foreCastData = [];

  for (let i = 0; i < list.length; i++) {
    const forecast = list[i];
    const date = new Date(forecast.dt_txt).toLocaleDateString("ru-RU", {
      weekday: "long",
    });

    const pod = forecast.sys.pod;

    const isToday = new Date().getDate() === new Date(forecast.dt_txt).getDate();

    if (date !== currentDate) {
      if (dailyTemperatures.day.length > 0 || dailyTemperatures.night.length > 0) {
        const avgDayTemp =
          dailyTemperatures.day.reduce((acc, temp) => acc + temp, 0) / dailyTemperatures.day.length;
        const avgNightTemp =
          dailyTemperatures.night.reduce((acc, temp) => acc + temp, 0) /
          dailyTemperatures.night.length;

        const maxTemp = Math.round(Math.max(...arrAllDayTemp));

        const temperature = `День: ${avgDayTemp ? Math.round(avgDayTemp) : "-"} °C, Ночь: ${
          avgNightTemp ? Math.round(avgNightTemp) : "-"
        } °C`;

        const icon = getIconForecast(dailyTemperatures.forecastDayIcon);
        console.log("icon", icon);

        const condidate = foreCastData.find((item) => {
          return item.weather[0].icon === icon;
        });

        const description = condidate.weather[0].description;

        const forecastItem = createForecastItemForecast({
          date: currentDate,
          temperature,
          description,
          icon,
          maxTemp,
        });

        forecastList.appendChild(forecastItem);
      }

      currentDate = date;
      dailyTemperatures = { day: [], night: [], forecastDayIcon: [] };
      foreCastData = [];
      arrAllDayTemp = [];
    }

    arrAllDayTemp.push(forecast.main.temp);

    if (isToday) {
      dailyTemperatures.forecastDayIcon.push(forecast.weather[0].icon.slice(0, -1) + "n");
    }

    if (pod === "d") {
      dailyTemperatures.forecastDayIcon.push(forecast.weather[0].icon);
      dailyTemperatures.day.push(forecast.main.temp);
    } else if (pod === "n") {
      dailyTemperatures.night.push(forecast.main.temp);
    }
    foreCastData.push(forecast);
  }
};

const renderWeatherHours = (list) => {
  const weatherHours = document.querySelector(".weather__weather__hours");
  weatherHours.innerHTML = "";
  for (let i = 0; i < list.length; i += 1) {
    const forecast = list[i];
    const date = new Date(forecast.dt * 1000).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    });
    const temperature = forecast.main.temp;

    const description = forecast.weather[0].description;
    const forecastI = createForecastItemCurrent({
      date,
      temperature,
      description,
      icon: forecast.weather[0].icon,
    });
    weatherHours.appendChild(forecastI);
  }
};

const createForecastItemCurrent = ({ date, temperature, description, icon }) => {
  const forecastItem = document.createElement("div");
  forecastItem.classList.add("forecast-item");
  forecastItem.innerHTML = `
        <p class="item__date">${date}</p>
        <p>Температура : ${Math.round(temperature)}°C </p>
        <p>Облачность: ${description}</p>
        <img src="./img/animated/${icon}.svg" class="forecast-weather-icon" />
      `;
  return forecastItem;
};

const createForecastItemForecast = ({ date, temperature, description, icon, maxTemp }) => {
  const forecastItem = document.createElement("div");
  forecastItem.classList.add("forecast-item");
  forecastItem.innerHTML = `
        <p class="item__date">${date}</p>
        <p>Температура: ${maxTemp}°C</p>
        <p>${temperature}</p>
        <p>Облачность: ${description}</p>
        <img src="./img/animated/${icon}.svg" class="forecast-weather-icon" />
      `;
  return forecastItem;
};

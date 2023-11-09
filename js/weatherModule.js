import { currentWeatherData } from "./currentWeatherData.js";
import { weatherForecastData } from "./weatherForecastData.js";
const apiKey = "1798cab96224b8f1764eecf22b457a00";
export const fetchWeatherData = async (data) => {
  const loader = document.querySelector(".loader-container");
  loader.classList.remove("hide");

  try {
    await currentWeatherData(data, apiKey);

    weatherForecastData(data, apiKey);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert(error.message);
  } finally {
    loader.classList.add("hide");
  }
};

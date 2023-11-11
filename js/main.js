import { loadResentlyListFromLocalStorage } from "./resentlyListData.js";

import { fetchWeatherData } from "./weatherModule.js";

document.addEventListener("DOMContentLoaded", function () {
  const btnGeolocation = document.querySelector(".geolocation");

  const inputSearch = document.querySelector(".input__input");

  btnGeolocation.addEventListener("click", getUserLocation);

  inputSearch.addEventListener("keyup", async (event) => {
    if (event.keyCode === 13) {
      const city = inputSearch.value;
      await fetchWeatherData(city);
      inputSearch.value = "";
    }
  });

  async function getUserLocation() {
    const successCallback = async (position) => {
      const data = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      await fetchWeatherData(data);
    };

    const errorCallback = (error) => {
      fetchWeatherData("minsk");
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
	getUserLocation();
  loadResentlyListFromLocalStorage();
});

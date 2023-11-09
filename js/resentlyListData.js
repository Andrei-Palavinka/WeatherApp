import { fetchWeatherData } from "./weatherModule.js";

export let resentlyList = [];
const resentlyContainer = document.querySelector(".resently__row");
export const addResentlyItem = (data) => {
  const indexDuble = resentlyList.findIndex((item) => item.id === data.id);

  if (indexDuble !== -1) {
    resentlyList.splice(indexDuble, 1);
  }

  resentlyList.unshift(data);

  if (resentlyList.length > 10) {
    resentlyList.pop();
  }
  saveResentlyListToLocalStorage();
};

resentlyContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("item__close")) {
    const itemId = event.target.getAttribute("data-id");
    removeResentlyItem(parseInt(itemId, 10));
    showResentlyItem();
    return;
  }

  if (event.target.closest(".resently__item")) {
    const selectedCity = event.target.closest(".resently__item").getAttribute("data-city");
    fetchWeatherData(selectedCity);
  }
});

export function loadResentlyListFromLocalStorage() {
  const storedResentlyList = localStorage.getItem("resentlyList");
  if (storedResentlyList) {
    resentlyList = JSON.parse(storedResentlyList);
    showResentlyItem();
  }
}

export function saveResentlyListToLocalStorage() {
  localStorage.setItem("resentlyList", JSON.stringify(resentlyList));
}

const removeResentlyItem = (id) => {
  const filtered = resentlyList.filter((item) => item.id !== id);

  resentlyList = filtered;
  saveResentlyListToLocalStorage();
};

export const showResentlyItem = () => {
  const html = resentlyList
    .map((item) => {
      return `<div class="resently__column">
                        <div class="resently__item item" data-city="${item.city}">
                        <div class="item__close" data-id="${item.id}">X</div>
                        <div class="item__title">${item.city}</div>
                        <div class="item__tem">${Math.round(item.temperature)}°C</div>
                        <div class="item__img">
                            <img src=${item.src} alt="" />
                        </div>
                        </div>
                     </div>`;
    })
    .join("");
  resentlyContainer.innerHTML = "";
  resentlyContainer.insertAdjacentHTML("afterbegin", html);
};

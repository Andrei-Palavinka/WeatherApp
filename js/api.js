const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export const apiRequest = async (url, method = "GET", data) => {
  let response;

  if (method === "GET") {
    response = await fetch(`${BASE_URL}${url}&lang=ru`);
  } else {
    response = await fetch(`${BASE_URL}${url}&lang=ru`, {
      method,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (response.status >= 400 && response.status < 600) {
    if (response.status === 404) {
      throw new Error(`Неверно введен город`);
      return;
    }
    throw new Error(`Error status: ${response.status}. Error message: ${response?.statusText}`);
  }

  const responseData = await response.json();

  return responseData;
};

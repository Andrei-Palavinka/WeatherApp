export const getMediumTemp = (list = []) => {
  const result = list.slice(0, 8).reduce((acc, item) => {
    return (acc += item.main.temp);
  }, 0);

  return result / list.length;
};

export const getIconForecast = (list) => {
  return (
    list
      .map((item) => {
        return item.slice(0, -1);
      })
      .sort((a, b) => b - a)[0] + "d"
  );
};

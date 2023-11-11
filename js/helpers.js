export const getMediumTemp = (list = []) => {
  const result = list.slice(0, 8).reduce((acc, item) => {
    return (acc += item.main.temp);
  }, 0);

  return result / list.length;
};

export const getIconForecast = (list) => {
  if (isDayExist(list)) {
    const filterArr = list.filter((item) => {
      return item.split("")[item.length - 1] == "d";
    });

    return (
      filterArr
        .map((item) => {
          return item.slice(0, -1);
        })
        .sort((a, b) => b - a)[0] + "d"
    );
  } else {
    return (
      list
        .map((item) => {
          return item.slice(0, -1);
        })
        .sort((a, b) => b - a)[0] + "n"
    );
  }
};

const isDayExist = (list) => {
  return list.join("").includes("d");
};

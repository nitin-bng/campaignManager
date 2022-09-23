import { getDateInFormat } from "../getDateInFormat";
import { dateFilter, isDateSmaller } from "./dateFilter";
import { getMonth } from "./getMonth";
import { initialValue } from "./initialValue";

let defaultStartDate = new Date();
let defaultEndDate = new Date();

defaultStartDate.setDate(defaultStartDate.getDate() - 30);
defaultEndDate.setDate(defaultEndDate.getDate() - 1);

const getBarGraphData = (
  data,
  campName = "",
  startDate = getDateInFormat(defaultStartDate),
  endDate = getDateInFormat(defaultEndDate)
) => {
  let result = {};
  let localData = data;
  let localDates = {};

  let todaysDate = new Date()

  if(endDate === getDateInFormat(todaysDate)){
    endDate = getDateInFormat(defaultEndDate)
  }

  if (campName) {
    localData = localData.filter((item) => item.campName === campName);
  }
  localData = localData.filter((item) => dateFilter(item, startDate, endDate));

  result = localData.reduce((prevValue, item) => {
    let newValue = JSON.parse(JSON.stringify(prevValue));
    let loopArray = item.dataByDates;

    for (let i = loopArray.length - 1; i >= 0; i--) {
      if (
        isDateSmaller(loopArray[i].date, startDate) &&
        isDateSmaller(endDate, loopArray[i].date)
      ) {
        localDates = { ...localDates, [loopArray[i].date]: 1 };
      }
    }
    return newValue;
  }, initialValue);

  result.labels = Object.keys(localDates).sort((a, b) =>
    isDateSmaller(a, b) ? 1 : -1
  );

  result = localData.reduce((prevValue, item) => {
    let newValue = JSON.parse(JSON.stringify(prevValue));
    let loopArray = item.dataByDates;

    for (let i = loopArray.length - 1; i >= 0; i--) {
      if (newValue.labels.includes(loopArray[i].date)) {
        let index = newValue.labels.indexOf(loopArray[i].date);
        newValue.datasets[0].data[index] =
          ~~newValue.datasets[0].data[index] + ~~loopArray[i]["picked"];
        newValue.datasets[1].data[index] =
          ~~newValue.datasets[1].data[index] + ~~loopArray[i]["progress"];
        newValue.datasets[2].data[index] =
          ~~newValue.datasets[2].data[index] +
          ~~loopArray[i]["picked"] +
          ~~loopArray[i]["progress"];
      }
    }

    return newValue;
  }, result);

  result.labels = result.labels.map(
    (item) => item.slice(8, 10) + " " + getMonth(item.slice(5, 7))
  );

  return result;
};

export { getBarGraphData };
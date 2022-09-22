import { dateFilter, isDateSmaller } from "./dateFilter";
import { initialValue } from "./initialValue";

const getBarGraphData = (data, campName = "", startDate = "", endDate = "") => {
  let localData = data;
  let localDates = {};
  let localSuccess = {};
  let localFailed = {};
  let localTotal = {};

  if (campName) {
    localData = localData.filter((item) => item.campName === campName);
  }
  if (startDate && endDate) {
    localData = localData.filter((item) =>
      dateFilter(item, startDate, endDate)
    );
  }

  localData = localData.reduce((prevValue, item) => {
    let newValue = { ...prevValue };
    let loopArray = item.dataByDates;
    for (let i = loopArray.length - 1; i >= 0; i--) {
      if (
        isDateSmaller(loopArray[i].date, startDate) &&
        isDateSmaller(endDate, loopArray[i].date)
      ) {
        localDates = { ...localDates, [loopArray[i].date]: 1 };

        localSuccess = {
          ...localSuccess,
          [loopArray[i].date]:
            ~~localSuccess[loopArray[i].date] + ~~loopArray[i].Success
        };
        localFailed = {
          ...localFailed,
          [loopArray[i].date]:
            ~~localFailed[loopArray[i].date] + ~~loopArray[i].Failed
        };
        localTotal = {
          ...localTotal,
          [loopArray[i].date]:
            ~~localTotal[loopArray[i].date] +
            ~~loopArray[i].Success +
            ~~loopArray[i].Failed
        };
      }
    }

    newValue.labels = Object.keys(localDates).map((item) => item);
    newValue.datasets[0] = Object.keys(localSuccess).map(
      (item) => localSuccess[item]
    );
    newValue.datasets[1] = Object.keys(localFailed).map(
      (item) => localFailed[item]
    );
    newValue.datasets[2] = Object.keys(localTotal).map(
      (item) => localTotal[item]
    );

    return newValue;
  }, initialValue);

  return localData;
};

export { getBarGraphData };

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
  let result = initialValue;
  let localData = data;
  let localDates = {};

  let todaysDate = new Date()

  // if(endDate === getDateInFormat(todaysDate)){
  //   endDate = getDateInFormat(defaultEndDate)
  // }

  if (campName && campName !== 'All Campaigns') {
    localData = localData.filter((item) => item.campName === campName);
  }
   
  localData = localData.filter((item) => dateFilter(item, startDate, endDate));

  // result = localData.reduce((prevValue, item) => {
  //   let newValue = JSON.parse(JSON.stringify(prevValue));
  //   let loopArray = item.dataByDates;

  //   for (let i = loopArray.length - 1; i >= 0; i--) {
  //     if (
  //       isDateSmaller(loopArray[i].date, startDate) &&
  //       isDateSmaller(endDate, loopArray[i].date)
  //     ) {
  //       localDates = { ...localDates, [loopArray[i].date]: 1 };
  //     }
  //   }
  //   return newValue;
  // }, JSON.parse(JSON.stringify(initialValue)));

  // result.labels = Object.keys(localDates).sort((a, b) =>
  //   isDateSmaller(a, b) ? 1 : -1
  // );

  const getLabels = () =>{
    let labels = []
    let date = new Date()
    let dateArray = startDate.split('-')
    date.setFullYear(dateArray[0])
    date.setMonth(dateArray[1]-1)
    date.setDate(dateArray[2])
    let loopValue = true

    while(loopValue){
      let formatedDate = getDateInFormat(date)
      if( formatedDate === endDate){
        labels = [...labels, endDate]
        loopValue = false
        break
      }
      labels = [...labels, formatedDate]
      date.setDate(date.getDate()+1)
    }
    return labels
  }

  result.labels = getLabels()

  result = localData.reduce((prevValue, item) => {
    let newValue = JSON.parse(JSON.stringify(prevValue));
    let loopArray = item.dataByDates;

    for (let i = loopArray.length - 1; i >= 0; i--) {
      if (newValue.labels.includes(loopArray[i].date)) {
        let index = newValue.labels.indexOf(loopArray[i].date);
        newValue.datasets[0].data[index] =
          ~~newValue.datasets[0].data[index] + ~~loopArray[i]["picked"];
        newValue.datasets[1].data[index] =
          ~~newValue.datasets[1].data[index] + ~~loopArray[i]["scheduled"];
        newValue.datasets[2].data[index] =
          ~~newValue.datasets[2].data[index] +
          ~~loopArray[i]["picked"] +
          ~~loopArray[i]["scheduled"];
      }
    }

    return newValue;
  }, result);

  let i = 30 - result.labels.length

  if(i >0){
    let dateArray = []
    if(!result.labels.length){
      dateArray = startDate.split('-')
      todaysDate.setFullYear(dateArray[0])
      todaysDate.setMonth(dateArray[1]-1)
      todaysDate.setDate(dateArray[2])
    }
    else{
      dateArray = result.labels[result.labels.length-1].split('-')
      todaysDate.setFullYear(dateArray[0])
      todaysDate.setMonth(dateArray[1]-1)
      todaysDate.setDate(~~dateArray[2]+1)
    }

     for(let j=i; j>0; j--){
      result.labels = [...result.labels, getDateInFormat(todaysDate)]
      todaysDate.setDate(~~todaysDate.getDate() + 1)
     }
  }
  result.labels = result.labels.map(
    (item) => item.slice(8, 10) + " " + getMonth(item.slice(5, 7))
  );

  return result;
};

export { getBarGraphData };
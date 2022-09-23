const isDateSmaller = (dateOne, dateTwo) => {
    let dateOneArray = dateOne.split("-").map((item) => ~~item);
    let dateTwoArray = dateTwo.split("-").map((item) => ~~item);
  
    if (
      dateOneArray[0] > dateTwoArray[0] ||
      (dateOneArray[0] === dateTwoArray[0] &&
        dateOneArray[1] > dateTwoArray[1]) ||
      (dateOneArray[0] === dateTwoArray[0] &&
        dateOneArray[1] === dateTwoArray[1] &&
        dateOneArray[2] >= dateTwoArray[2])
    ) {
      return true;
    }
  
    return false;
  };
  
  const dateFilter = (item, startDate, endDate) => {
    if (
      (isDateSmaller(startDate, item.campStartDate) &&
        isDateSmaller(item.campEndDate, startDate)) ||
      (isDateSmaller(endDate, item.campStartDate) &&
        isDateSmaller(item.campEndDate, endDate)) ||
      (isDateSmaller(item.campStartDate, startDate) &&
        isDateSmaller(endDate, item.campStartDate)) ||
      (isDateSmaller(item.campEndDate, startDate) &&
        isDateSmaller(endDate, item.campEndDate))
    ) {
      return true;
    }
    return false;
  };
  
  export { dateFilter, isDateSmaller };
  
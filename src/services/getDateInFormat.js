const getDateInFormat = (date) =>{
    let result = ''
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let currDate = date.getDate()

    result =  year + '-'
    if(month > 9){
      result += month
    }

    else{
      result += '0'+ month
    }
    result += '-'
    if(currDate > 9){
      result += currDate 
    }
    else{
      result += '0'+ currDate 
    }
    return result
  }

  const getMultipleDatesInFormat = (date) =>{
    let result = ''
    let year = date.year
    let month = date.month.number
    let currDate = date.day

    result =  year + '/'
    if(month > 9){
      result += month
    }

    else{
      result += '0'+ month
    }
    result += '/'
    if(currDate > 9){
      result += currDate 
    }
    else{
      result += '0'+ currDate 
    }
    return result
  }
  export {getDateInFormat, getMultipleDatesInFormat}
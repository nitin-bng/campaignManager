const changeTimeFormatForBackend = (date) =>{ 
    if(date){
        let result = ''
        result += date.getHours().toString().length >= 2 ? date.getHours() : '0' + date.getHours()
        result += ':'
        result += date.getMinutes().toString().length >= 2 ? date.getMinutes() : '0' + date.getMinutes();
        result += ':00'
        return result
    }
    else{
        return date
    }
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

const changeTimeFormatForFrontend = time =>{
   if(time){ 
        let date = new Date().toString()
        let result = ''
        let currPosition = 0

        for(let i=0; i<date.length; i++){
            console.log('nitin function loop', date[i], result)
            result += date[i]
            if(date[i] === ':'){
                result = result.replaceAt(i-2, [time[currPosition]])
                currPosition++
                result = result.replaceAt(i-1, [time[currPosition]])
                currPosition++
                currPosition++
            }
        }
        return result
    }
    else{
        return time
    }
} 

export {changeTimeFormatForFrontend, changeTimeFormatForBackend}
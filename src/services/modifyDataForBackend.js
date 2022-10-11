const arrangeActionsData = (actions, waitTime,repeatCount ) => { 
    actions.map(obj=>{
        if(obj['actions']){
            if(obj.actions.length){
                obj = {...obj, node_type: "PROCESSING", actions: arrangeActionsData(obj.actions)}
            }
            else{
                obj = {...obj, node_type: "LEAF"}
            }
        }
        obj = {...obj, waitTime, repeatCount}

        return obj
    })
}


const modifyDataForBackend = (data, waitTime=0, repeatCount=0) =>{
    let result = data
    result.actions = arrangeActionsData(result.actions, waitTime, repeatCount)
    result.language = arrangeActionsData(result.language, waitTime, repeatCount)
    result = {...result, waitTime, repeatCount}
}

export {modifyDataForBackend}
const arrangeActionsData = (actions, waitTime,repeatCount, bargein ) => { 
    return actions.map(obj=>{
        if(obj['actions']){
            if(obj.actions.length){
                obj = {...obj, node_type: "PROCESSING", actions: arrangeActionsData(obj.actions, waitTime,repeatCount, bargein)}
            }
            else{
                obj = {...obj, node_type: "LEAF"}
            }
        }
        obj = {...obj, waitTime, repeatCount}

        if(bargein){
            obj = {...obj, type:  'PLAY_BARGEIN', actionType:{...obj.actionType, ivr: 'PLAY_BARGEIN'}}
        }

        return obj
    })
}



const modifyDataForBackend = (data, waitTime=0, repeatCount=0, bargein=false) =>{
    let result = data
    result.actions = arrangeActionsData(result.actions, waitTime, repeatCount, bargein)
    result.language[0].actions = arrangeActionsData(result.language[0].actions, waitTime, repeatCount, bargein)
    result = {...result, waitTime, repeatCount}
    if(bargein){
        result = {...result, actionType:{...result.actionType, ivr: 'PLAY_BARGEIN'}}
    }

    return result
}

export {modifyDataForBackend}
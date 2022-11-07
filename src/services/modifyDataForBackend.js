const arrangeActionsData = (actions, waitTime,repeatCount, bargein, isInActions = false, channel = false ) => { 
    return actions.map(obj=>{
        if(obj['actions']){
            if(obj.actions.length){
                obj = {...obj, node_type: "PROCESSING", actions: arrangeActionsData(obj.actions, waitTime,repeatCount, bargein,isInActions, channel)}
            }
            else{
                if(obj.node_type !== 'END'){
                    obj = {...obj, node_type: "LEAF"}
                }
            }
        }
        if(obj.node_type !== "END" && obj.node_type !== "LEAF"){
            obj = {...obj, waitTime, repeatCount, actionType:{...obj.actionType, ivr: 'PLAY', ussd: 'HITURL_USSD', sms: 'HITURL_SMS'}}
        }else{
            obj = {...obj, waitTime: 0, repeatCount: 0, actionType:{...obj.actionType, ivr: 'PLAY', ussd: 'HITURL_USSD', sms: 'HITURL_SMS'}}
        }

        if(channel){
            obj = {...obj, actionType:{...obj.actionType, [channel.toLowerCase()]: obj.type}}
        }

        if(isInActions){
            obj = {...obj, file:{...obj.file, ivr: {...obj.audio_file}, sms:{...obj.audio_file}, ussd: {...obj.audio_file}}}
        }

        if(bargein){
            obj = {...obj, type:  obj.type === 'PLAY' ? 'PLAY_BARGEIN' : obj.type, actionType:{...obj.actionType, ivr: obj.actionType.ivr === 'PLAY' ? 'PLAY_BARGEIN' : obj.actionType.ivr}}
        }

        return obj
    })
}

const modifyDataForBackend = (data, waitTime=0, repeatCount=0, bargein=false, channel) =>{
    let result = {...data}
    result = {...result,actions: arrangeActionsData(result.actions, waitTime, repeatCount, bargein, true, channel)}
    result = {...result, language: [{...result.language[0], actions: arrangeActionsData(result.language[0].actions, waitTime, repeatCount, bargein)}]}
    result = {...result, waitTime, repeatCount}
    if(bargein){
        result = {...result, actionType:{...result.actionType, ivr: 'PLAY_BARGEIN'}}
    }

    return result
}

export {modifyDataForBackend}
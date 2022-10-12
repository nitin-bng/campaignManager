import { TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useError } from "../../store/errorContext"

const MessageUploadForMainDTMF = ({handleUSSD, localStore, lang, global, hideItemStyle, channel}) =>{
    const {showError, errorDispatch} = useError()
    const [isError, setIsError] = useState(true)
    
    useEffect(()=>{
    if(hideItemStyle === undefined){
        if(!isError){
            errorDispatch({type:'MESSAGE', payload: false})
        }
        else{
            errorDispatch({type:'MESSAGE', payload: true})
        }
    }
    }, [isError])

    return            <TextField
    id="outlined-multiline-static"
    label={` Message Response for ${localStore.ivrCampFlowData.flow.actions[
      global.dtmf_key - 1
    ].input[channel === 'USSD' ? "ussd_key": channel === 'SMS' && 'sms_key']} input key`}
    multiline
    rows={2}
    variant="outlined"
    onChange={(e) => {
        setIsError(e.target.value === '' ? true : false)
        handleUSSD(e.target.value, lang)
    }}
    error={
      showError
        ? localStore.ivrCampFlowData.flow.actions[
          global.dtmf_key - 1
        ].audio_file[lang]
          ? false
          : true
        : false
    }
    style={{ width: "100%", margin:"1rem" }}
  />

}

export {MessageUploadForMainDTMF}
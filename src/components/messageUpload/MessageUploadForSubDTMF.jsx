import { TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useError } from "../../store/errorContext"

const MessageUploadForSubDTMF = ({traverseAndModify, localStore, current, lang, hideItemStyle}) =>{

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

    return    <TextField
    id="outlined-multiline-static"
    label={`Message Response for ${traverseAndModify(
      current.id,
      current,
      "ussd_msg",
      null,
      "read",
      lang
    )} input key `}
    multiline
    rows={2}
    variant="outlined"
    onChange={(e) =>{
      setIsError(e.target.value === '' ? true : false)
      traverseAndModify(
        current.id,
        current,
        "ussd_msg",
        e.target.value,
        "edit",
        lang
      )}
    }
    error={
      showError
        ? traverseAndModify(
          current.id,
          current,
          "ussd_msg",
          null,
          "read",
          lang
        )
          ? false
          : true
        : false
    }
    style={{ width: "100%", margin:"1rem" }}
  />
}

export {MessageUploadForSubDTMF}
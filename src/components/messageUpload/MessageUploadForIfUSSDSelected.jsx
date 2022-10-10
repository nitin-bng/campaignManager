import { TextField } from "@mui/material";
import { useEffect, useContext, useState } from "react";
import { useError } from "../../store/errorContext";
import { store } from "../../store/store";

const languageNames = {
  _E: "English",
  _H: "Hindi",
  _A: "Arabic",
  _S: "Spanish",
};

const MessageUploadForIfUSSDSelected = ({lang, hideItemStyle}) =>{
    const {errorDispatch, showError, errorState} = useError()
    const globalState = useContext(store);
    const localStore = globalState.state;
    const { dispatch } = globalState;
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

    
  const handleUSSD = (msg, languageCode) => {
    localStore.ivrCampFlowData.flow["main_audio_file"] = localStore
      .ivrCampFlowData.flow["main_audio_file"]
      ? localStore.ivrCampFlowData.flow["main_audio_file"]
      : {};
    localStore.ivrCampFlowData.flow.main_audio_file[languageCode] = msg;
    localStore.ivrCampFlowData.flow.main_file["sms"] = localStore
      .ivrCampFlowData.flow.main_file["sms"]
      ? localStore.ivrCampFlowData.flow.main_file["sms"]
      : {};
    localStore.ivrCampFlowData.flow.main_file["sms"][languageCode] = msg;
    localStore.ivrCampFlowData.flow.main_file["ussd"] = localStore
      .ivrCampFlowData.flow.main_file["ussd"]
      ? localStore.ivrCampFlowData.flow.main_file["ussd"]
      : {};
    localStore.ivrCampFlowData.flow.main_file["ussd"][languageCode] = msg;
    dispatch({ type: "SET_DATA", nState: localStore });
  };


    return  <TextField
                hideItemStyle={hideItemStyle}
                localStore={localStore}
                lang={lang}
                id="outlined-multiline-static"
                // label={`Welcome Message in ${languageNames[lang]}`}
                label= {`Welcome ${localStore.ivrCampFlowData.flow.language[0].actions.length > 1 ? "& Language Selection": ""} Node in ${languageNames[lang]}`}
                multiline
                rows={2}
                value={localStore.ivrCampFlowData.flow.main_file["ussd"][lang]}
                variant="outlined"
                onChange={(e) => {
                    setIsError(e.target.value === '' ? true : false)
                    handleUSSD(e.target.value, lang)
                }}
                error={
                    showError
                    ? localStore.ivrCampFlowData.flow.main_file["ussd"][lang]
                        ? false
                        : true
                    : false
                }
                style={{ width: "100%", margin: "1rem" }}
    />
}

export {MessageUploadForIfUSSDSelected}
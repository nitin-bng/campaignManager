import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useError } from "../../store/errorContext";


const FileUploaderForMainDTMF = ({lang, hideItemStyle, parentNode, global, globalState, uploadFiles, AudioFiles}) =>{
    const [isError, setIsError] = useState(true)
    const {errorDispatch, showError} = useError()
    const [showLoader, setShowLoader] = useState(false)


    useEffect(()=>{
        if (hideItemStyle === undefined) {
          if(!globalState.state.ivrCampFlowData.flow.actions[
            global.dtmf_key - 1
          ].audio_file[lang]){
            errorDispatch({ type: "AUDIO", payload: true });
          }else{
            setIsError(false)
          }
        }
        
        return () => !globalState.state.ivrCampFlowData.flow.actions[
          global.dtmf_key - 1
        ].audio_file[lang] && errorDispatch({ type: "AUDIO", payload: false });
        }
    ,[])

    console.log('file main error', showError, isError)

    return ( 
    <div
        className="file__chooser__container"
        style={(showError && isError)?{
            width: "200px",
            display: "flex",
            height: "fit-content",
            flexDirection: "column",
            border: "2px solid red",
          }:{
          width: "200px",
          display: "flex",
          height: "fit-content",
          flexDirection: "column",
        }}
      >
        <input
          accept="audio/wav"
          type="file"
          class="custom-file-input"
          name="main_audio_file"
          style={{
            display: "flex",
            overflow: "hidden",
          }}
          onChange={async(event) => {
            setShowLoader(true)
            await uploadFiles(
              parentNode +
                "_" +
                global.dtmf_key,
              event,
              event.currentTarget.files,
              lang,
            );
            setIsError(false)
            setShowLoader(false)
          }}
          required
        />
        {globalState.state.ivrCampFlowData.flow.actions[
          global.dtmf_key - 1
        ].audio_file[lang] ? (
          
          <div
            style={{
              border: ".2px solid black",
              width: "200px",
              fontSize: "10px",
              wordWrap: "break-word",
              marginBottom: "10px",
              paddingBottom: "3px",
            }}
          >
            <AudioFiles
              dtmf={global.dtmf_key - 1}
              lang={lang}
            />
          </div>
        ) : 
        null}
        {showLoader && <CircularProgress />}
      </div>)
}

export {FileUploaderForMainDTMF}
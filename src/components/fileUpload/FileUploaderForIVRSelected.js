import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useError } from "../../store/errorContext";

const FileUploaderForIVRSelected = ({lang, uploadFiles, localStore, GetMainAudioFiles, hideItemStyle}) =>{
    const {errorDispatch, showError} = useError()
    const [isError, setIsError] = useState(true)
    const [showLoader, setShowLoader] = useState(false)

    useEffect(()=>{
        if(hideItemStyle === undefined){
            errorDispatch({type:'AUDIO', payload: true})
          }
          return () =>  errorDispatch({type:'AUDIO', payload: false})
    },[])

    return (
      <div
        className="file__chooser__container"
        style={{
          width: "200px",
          display: "flex",
          height: "fit-content",
          flexDirection: "column",
        }}
      >
        <input
          style={(showError && isError) ? {
            border: "2px solid red",
            display: "flex",
            overflow: "hidden",}:{
            display: "flex",
            overflow: "hidden",  
          }}
          accept="audio/wav"
          type="file"
          class="custom-file-input"
          name="main_audio_file"
          onChange={async(event) => {
            setShowLoader(true)
            await uploadFiles(
              "main_audio_file",
              event,
              event.currentTarget.files,
              lang,
            );
            setIsError(false)
            setShowLoader(false)
          }}
          required
        />
        {localStore.ivrCampFlowData.flow.main_audio_file &&
        localStore.ivrCampFlowData.flow.main_audio_file[lang] &&
        localStore.ivrCampFlowData.flow.main_audio_file[lang] !==
          "" ? (
          <>
            <div
              style={{
                border: ".2px solid black",
                width: "200px",
                fontSize: "10px",
                wordWrap: "break-word",
                marginBottom:"10px",
                paddingBottom:"3px"
              }}
              item
              className="fileNames"
              id={lang + "mainAudioShow"}
            >
              {GetMainAudioFiles(lang, "MainAudioFile")}
            </div>
          </>
        ) : null}
        {showLoader && <CircularProgress />}
      </div>)
}

export {FileUploaderForIVRSelected}
import { CircularProgress } from "@mui/material";
import { useContext } from "react";
import { useState } from "react";
import { useError } from "../../store/errorContext";
import { store } from "../../store/store";

export const FileUploaderFotThankYou = ({lang, languageNames, uploadFiles, AudioFiles, hideItemStyle}) =>{

    const {showError} = useError()
    const [showLoader, setShowLoader] = useState(false)
    let globalState = useContext(store);
    let localStore = globalState.state
    let {dispatch} = globalState

    const deleteAudioFile = () =>{
      console.log('nitin inside', localStore.ivrCampFlowData.flow.actions[localStore.ivrCampFlowData.flow.actions.length-1])
      localStore.ivrCampFlowData.flow.actions[localStore.ivrCampFlowData.flow.actions.length-1].file['ivr'][lang] = ''
      localStore.ivrCampFlowData.flow.actions[localStore.ivrCampFlowData.flow.actions.length-1].audio_file[lang] = ''

      dispatch({ type: "SET_DATA", nState: localStore });
    }

    return <div
    className="file__chooser__container"
    style={ showError ? {
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
      justifyContent:"center",
      alignItems:"center"
    }}
  >
    <div style={{fontSize:".7rem", alignContent:"center"}}>Upload thanks prompt for {languageNames[lang]}</div>
    <input
      accept="audio/wav"
      type="file"
      class="custom-file-input"
      name="thanks_audio_file"
      style={{
        display: "flex",
        overflow: "hidden",
      }}
      onChange={async(event) => {
        setShowLoader(true)
        await uploadFiles(
          "thanks_audio_file",
          event,
          event.currentTarget.files,
          lang,
        );
        // setIsError(false)
        setShowLoader(false)
      }}
      required
    />
    {globalState.state.ivrCampFlowData.flow.actions[
     globalState.state.ivrCampFlowData.flow.actions.length - 1
    ]?.audio_file[lang] ? (
      <>
      <div
        style={{
          border: ".2px solid black",
          width: "200px",
          fontSize: "10px",
          wordWrap: "break-word",
          marginBottom: "10px",
          paddingBottom: "3px",
        }}
        className={hideItemStyle}
      >
        <AudioFiles
          dtmf={ globalState.state.ivrCampFlowData.flow.actions.length - 1}
          lang={lang}
        />
      </div>
        <button onClick={()=>deleteAudioFile()}>Delete</button>
        </>
    ) : 
    null}
    {showLoader && <CircularProgress />}
  </div>
}
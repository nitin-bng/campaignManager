import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useError } from "../../store/errorContext";

const FileUploaderForSubDTMF =({lang, current, main_audio_file, uploadFiles, traverseAndModify, AudioFilesL2, hideItemStyle}) =>{
    const [isError, setIsError] = useState(true)
    const {errorDispatch, showError} = useError()
    const [showLoader, setShowLoader] = useState(false)


    useEffect(()=>{
        if (hideItemStyle === undefined) {
          if(!traverseAndModify(
            current.id,
            null,
            null,
            null,
            "return"
          )?.audio_file[lang]){
            errorDispatch({ type: "AUDIO", payload: true });
          }else{
            setIsError(false)
          }
        }
        
        return () => !traverseAndModify(
          current.id,
          null,
          null,
          null,
          "return"
        )?.audio_file[lang] && errorDispatch({ type: "AUDIO", payload: false });
        }
    ,[])

    const deleteAudioFile = () =>{
      // globalState.state.ivrCampFlowData.flow.actions[global.dtmf_key - 1].audio_file[lang] = ''
      // globalState.state.ivrCampFlowData.flow.actions[global.dtmf_key - 1].file['ivr'][lang] = ''
      // dispatch({ type: "SET_DATA", nState: globalState.state });
    }

    return (<div className="file__chooser__container"  style={(showError && isError) ? {
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
      }}>
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
              "level" +
                current.level +
                "_" +
                current.parent_dtmf +
                "_" +
                current.dtmf_key +
                "_" +
                lang,
              event,
              event.currentTarget.files,
              lang,
            );
            setIsError(false)
            setShowLoader(false)
          }}
          required
        />
        {traverseAndModify(
                current.id,
                null,
                null,
                null,
                "return"
              ).audio_file[lang] ? (
          <>
            <br></br>
            <div
              item
              className="fileNames"
              id={lang + "mainAudioShow"}
            >
              {traverseAndModify(
                current.id,
                null,
                null,
                null,
                "return"
              ).audio_file[lang] ? (
                <>
                <div style={{
                  border: ".2px solid black",
                  width: "200px",
                  fontSize: "10px",
                  wordWrap: "break-word",
                  marginBottom: "10px",
                  paddingBottom: "3px",
                }}>
                  <AudioFilesL2
                    current={current}
                    parentDtmf={
                      current.parent_dtmf - 1
                    }
                    currDtmf={current.dtmf_key - 1}
                    lang={lang}
                  />
                </div>
                <button onClick={()=> deleteAudioFile()}>Delete</button>
                </>
              ) : (   
                null
              )}
            </div>
          </>
        ) : null}
        {showLoader && <CircularProgress />}
      </div>)
}

export {FileUploaderForSubDTMF}
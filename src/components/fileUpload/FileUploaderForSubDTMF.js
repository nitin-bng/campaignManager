import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useError } from "../../store/errorContext";

const FileUploaderForSubDTMF =({lang, current, main_audio_file, uploadFiles, traverseAndModify, AudioFilesL2, hideItemStyle}) =>{
    const [isError, setIsError] = useState(true)
    const {errorDispatch, showError} = useError()
    const [showLoader, setShowLoader] = useState(false)


    useEffect(()=>{
        if (hideItemStyle === undefined) {
            errorDispatch({ type: "AUDIO", payload: true });
        }
        }
    ,[])


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
        // border: "2px solid blue",
      }}>
        <input
          accept="audio/wav"
          type="file"
          class="custom-file-input"
          name="main_audio_file"
          style={{
            // border: "2px solid green",
            display: "flex",
            overflow: "hidden",
            // height: "10px",
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
        {main_audio_file &&
        main_audio_file[
          lang
        ] &&
        main_audio_file[
          lang
        ] !== "" ? (
          <>
            <br></br>
            {/* show all the audio files uploaded */}
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
              ) : (
                // <div>
                //   Please upload the audio file
                // </div>
                null
              )}
            </div>
          </>
        ) : null}
        {showLoader && <CircularProgress />}
      </div>)
}

export {FileUploaderForSubDTMF}
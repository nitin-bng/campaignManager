import React, { useContext, useEffect, useRef, useState, useMemo } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CommonContext } from "../../../../../../helpers/CommonContext";
import "./renderingcomponentonlanguageselect.css";
import ReactAudioPlayer from "react-audio-player";
import config from "../../../../../../ApiConfig/Config";
import { store } from "../../../../../../store/store";
import { useError } from "../../../../../../store/errorContext";
import { CircularProgress } from "@mui/material";

const RenderingComponentOnLanguageSelect = (props) => {
  console.log("props for wait time ", props);
  let globalState = useContext(store);
  const { dispatch } = globalState;
  let localStore = globalState.state;
  console.log("language props ====>", props);
  const { showError, errorDispatch } = useError();
  const [isError, setIsError] = useState(true);
  const [normalState, setNormalState] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const saveValues = (e, type) => {
    debugger;
    let id = e.target.id.split("-");
    for (
      var i = 0;
      i < localStore.ivrCampFlowData.flow.language[0].actions.length;
      i++
    ) {
      if (
        id[1] == localStore.ivrCampFlowData.flow.language[0].actions[i].language
      ) {
        if (type === "IVR") {
          localStore.ivrCampFlowData.flow.language[0].actions[i].waitTime =
            e.target.value;
          console.log("localstore", localStore);
        } else if (type === "USSD") {
          localStore.ivrCampFlowData.flow.language[0].actions[
            i
          ].input.ussd_key = e.target.value;
        }
      }

      dispatch({ type: "SET_DATA", nState: localStore });
    }
  };

  const getLangWaitTime = (lang) => {
    console.log("waittime=>", lang);
    console.log(
      "rishabh test lang array",
      globalState.state.ivrCampFlowData.flow.language
    );
    for (
      var i = 0;
      i < globalState.state.ivrCampFlowData.flow.language[0].actions.length;
      i++
    ) {
      if (
        lang ==
        globalState.state.ivrCampFlowData.flow.language[0].actions[i].language
      ) {
        console.log(
          "condition met",
          globalState.state.ivrCampFlowData.flow.language[0]
        );
        return {
          waitTime:
            globalState.state.ivrCampFlowData.flow.language[0].actions[i]
              .waitTime,
          ussdKey:
            globalState.state.ivrCampFlowData.flow.language[0].actions[i].input
              .ussd_key,
        };
      }
    }
    console.log("condition not met");
  };
  const { waitTime, ussdKey } = useMemo(() => {
    return getLangWaitTime(props.languageCode);
  }, [normalState]);

  useEffect(() => {
    if (props.hideItemStyle === undefined) {
      if(localStore.ivrCampFlowData.flow.channel === 'IVR'){
        errorDispatch({ type: "AUDIO", payload: true });
      }
    }
    errorDispatch({
      type: "RENDERING_COMPONENT_ON_LANGUAGE_SELECT",
      payload: true,
    });
    return () =>
      errorDispatch({
        type: "RENDERING_COMPONENT_ON_LANGUAGE_SELECT",
        payload: false,
      });
  }, []);

  useEffect(() => {
    if (
      (localStore.ivrCampFlowData.flow.channel === "IVR" && waitTime) ||
      (localStore.ivrCampFlowData.flow.channel === "USSD" && ussdKey)
    ) {
      errorDispatch({
        type: "RENDERING_COMPONENT_ON_LANGUAGE_SELECT",
        payload: false,
      });
    }
  }, [waitTime, localStore.ivrCampFlowData.flow.channel, ussdKey]);

  useEffect(()=>{
    if(localStore.ivrCampFlowData.flow.channel === 'USSD' && props.hideItemStyle === undefined ){
      if(!isError){
      errorDispatch({ type: "RENDERING_COMPONENT_ON_LANGUAGE_SELECT", payload: false });
    }
    else{
        errorDispatch({ type: "RENDERING_COMPONENT_ON_LANGUAGE_SELECT", payload: true });
      }
    }
  }, [isError])

  const uploadFiles = async (target, e, files, lang) => {
    debugger;
    console.log(
      "-------target and files------",
      target,
      files,
      "event",
      e,
      "lang",
      lang
    );
    try {
      const uploadedFiles = await uploadMultipleFiles(files);
      console.log("%c ==FILES UPLOADED==", "background:yellow", uploadedFiles);
      let localStore = globalState.state;
      const localFileName = uploadedFiles.response;
      const serverFileName = uploadedFiles.key;
      localStore.temp.uploads.push({
        l_name: localFileName,
        s_name: serverFileName,
      });

      if (target === "main_audio_file" || target === "thanks_audio_file") {
        const key = e.target.name;
        const dict = {};
        let oldStateFiles = "";
        if (
          localStore.ivrCampFlowData.flow &&
          localStore.ivrCampFlowData.flow[target] &&
          localStore.ivrCampFlowData.flow[target][lang]
        ) {
          oldStateFiles = localStore.ivrCampFlowData.flow[target][lang] + ",";
        }

        console.log("oldState", oldStateFiles);
        dict[lang] = oldStateFiles + uploadedFiles.response;
        localStore.ivrCampFlowData.flow[key] = {
          ...localStore.ivrCampFlowData.flow[key],
          ...dict,
        };
        localStore.ivrCampFlowData.flow.main_file["ivr"][lang] =
          oldStateFiles + uploadedFiles.response;
        localStore.ivrCampFlowData.flow["type"] = "PLAY";
        dispatch({ type: "SET_MAIN_AUDIO_FILE", nState: localStore });
      } else if (target === "lang_audio_file") {
        let id = e.target.id.split("-");
        console.log(id);
        const key = e.target.name;
        const dict = {};
        let oldStateFiles = "";
        if (
          localStore.ivrCampFlowData.flow &&
          localStore.ivrCampFlowData.flow[target] &&
          localStore.ivrCampFlowData.flow[target][lang]
        ) {
          oldStateFiles = localStore.ivrCampFlowData.flow[target][lang] + ",";
        }

        console.log("oldState", oldStateFiles);
        dict[lang] = oldStateFiles + uploadedFiles.response;
        localStore.ivrCampFlowData.flow[key] = {
          ...localStore.ivrCampFlowData.flow[key],
          ...dict,
        };
        for (
          var i = 0;
          i < localStore.ivrCampFlowData.flow.language[0].actions.length;
          i++
        ) {
          if (
            id[0] ==
            localStore.ivrCampFlowData.flow.language[0].actions[i].language
          ) {
            if (
              localStore.ivrCampFlowData.flow &&
              localStore.ivrCampFlowData.flow.language[0].actions[i].lang_file[
                "ivr"
              ] !== ""
            ) {
              oldStateFiles =
                localStore.ivrCampFlowData.flow.language[0].actions[i]
                  .lang_file["ivr"] + ",";
            }
            localStore.ivrCampFlowData.flow.language[0].actions[i].lang_file[
              "ivr"
            ] = oldStateFiles + uploadedFiles.response;
          }
        }
        dispatch({ type: "SET_DATA", nState: localStore });
      } else if (target === "repeat_audio_file") {
        const dict = {};
        dict[lang] = uploadedFiles[0].key;
        localStore.ivrCampFlowData.flow.repeat.audio_file = dict;
        dispatch({ type: "SET_DATA", nState: localStore });
      } else {
        const targetArray = target.split("_");
        console.log(target, "......", targetArray);
        if (targetArray[0] + targetArray[1] === "mainaudio") {
          const dtmfToSet = targetArray[2] - 1;
          localStore.ivrCampFlowData.flow.actions[dtmfToSet].audio_file[lang] =
            localStore.ivrCampFlowData.flow.actions[dtmfToSet].audio_file[lang]
              ? localStore.ivrCampFlowData.flow.actions[dtmfToSet].audio_file[
                  lang
                ] +
                "," +
                uploadedFiles.response
              : uploadedFiles.response;
          localStore.ivrCampFlowData.flow.actions[dtmfToSet].file["ivr"][lang] =
            localStore.ivrCampFlowData.flow.actions[dtmfToSet].file["ivr"][lang]
              ? localStore.ivrCampFlowData.flow.actions[dtmfToSet].file["ivr"][
                  lang
                ] +
                "," +
                uploadedFiles.response
              : uploadedFiles.response;
          dispatch({ type: "SET_DATA", nState: localStore });
        } else if (targetArray[0] === "level2") {
          const parent_dtmf = targetArray[1];
          const current_dtmf = targetArray[2];
          localStore.ivrCampFlowData.flow.actions[parent_dtmf - 1].actions[
            current_dtmf - 1
          ].audio_file[lang] = localStore.ivrCampFlowData.flow.actions[
            parent_dtmf - 1
          ].actions[current_dtmf - 1].audio_file[lang]
            ? localStore.ivrCampFlowData.flow.actions[parent_dtmf - 1].actions[
                current_dtmf - 1
              ].audio_file[lang] +
              "," +
              uploadedFiles[0].key
            : uploadedFiles[0].key;
          dispatch({ type: "SET_DATA", nState: localStore });
        } else if (targetArray[0] === "level3") {
          const gparent = targetArray[1];
          const parent_dtmf = targetArray[2];
          const current_dtmf = targetArray[3];
          localStore.ivrCampFlowData.flow.actions[gparent].actions[
            parent_dtmf - 1
          ].actions[current_dtmf - 1].audio_file[lang] = localStore
            .ivrCampFlowData.flow.actions[gparent].actions[parent_dtmf - 1]
            .actions[current_dtmf - 1].audio_file[lang]
            ? localStore.ivrCampFlowData.flow.actions[gparent].actions[
                parent_dtmf - 1
              ].actions[current_dtmf - 1].audio_file[lang] +
              "," +
              uploadedFiles[0].key
            : uploadedFiles[0].key;
          dispatch({ type: "SET_DATA", nState: localStore });
        } else if (targetArray[0] + targetArray[1] === "repeataudio") {
          const current_dtmf = targetArray[2];
          const dict = {};
          dict[lang] = uploadedFiles[0].key;
          localStore.ivrCampFlowData.flow.actions[
            current_dtmf - 1
          ].repeat.audio_file = dict;
          dispatch({ type: "SET_DATA", nState: localStore });
        }
      }
    } catch (e) {
      console.log(
        "%c ----------------- ERROR IN FILEUPLOAD ---------------------",
        "background:red",
        e
      );
      return;
    }
  };

  async function uploadMultipleFiles(props) {
    debugger;
    console.log("-----------------props------", props);
    const files = [...props];
    var formData = new FormData();
    files.forEach((e) => {
      formData.append("file", e);
      console.log("-----------------props------", formData.getAll("file"));
    });
    const path = config.server.path + ":" + "5002" + "" + "/bng/ui/uploadFile";
    console.log("Path is", path);
    return await fetch(path, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("got response from file upload....", response);
        errorDispatch({ type: "AUDIO", payload: false });
        return response;
      })
      .catch((e) => {
        console.log("error in file upload", e);
      });
  }

  const GetMainAudioFiles = (lang, type) => {
    debugger;
    let id = lang.split("-");
    console.log(id);
    if (type == "MainAudioFile") {
      console.log("getMainAudio", type);
      var Filelist = globalState.state.ivrCampFlowData.flow.main_audio_file[
        id[0]
      ]
        .split(",")
        .map((e, index) => {
          return (
            <span key={e}>
              <span style={{ color: "darkgray" }}>
                {index + 1} - {e}
              </span>
              <br />
              <div
                className="playingOptions"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "5px",
                }}
              >
                <ReactAudioPlayer
                  src={config.server.path + `/cm_data/audio/${e}`}
                  controls
                />
              </div>
            </span>
          );
        });
    } else if (type == "LangAudioFile") {
      console.log("getMainAudio", type);
      for (
        var i = 0;
        i < globalState.state.ivrCampFlowData.flow.language[0].actions.length;
        i++
      ) {
        if (
          id[0] ==
          globalState.state.ivrCampFlowData.flow.language[0].actions[i].language
        ) {
          var Filelist =
            globalState.state.ivrCampFlowData.flow.language[0].actions[
              i
            ].lang_file["ivr"]
              .split(",")
              .map((e, index) => {
                return (
                  <span key={e}>
                    <span style={{ color: "darkgray" }}>
                      {index + 1} - {e}
                    </span>
                    <br />
                    <div
                      className="playingOptions"
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "auto",
                      }}
                    >
                      <ReactAudioPlayer
                        src={config.server.path + `/cm_data/audio/${e}`}
                        controls
                      />
                    </div>
                  </span>
                );
              });
        }
      }
    }
    return <span> {Filelist} </span>;
  };

  const handleUSSD = (msg) =>{
    localStore.ivrCampFlowData.flow['lang_audio_file'] = localStore.ivrCampFlowData.flow['lang_audio_file'] ? localStore.ivrCampFlowData.flow['lang_audio_file'] : {}
    localStore.ivrCampFlowData.flow.lang_audio_file[props.languageCode] = msg
    localStore.ivrCampFlowData.flow.language[0].actions = localStore.ivrCampFlowData.flow.language[0].actions.map(item=>{
    if(item.languageName === props.lang){
      item.lang_file['sms'] = msg
      item.lang_file['ussd'] = msg
    }
    return item
    })
    dispatch({ type: "SET_DATA", nState: localStore });
    setIsError(msg === '');
  }

  return (
    <>
      {localStore.ivrCampFlowData.flow.channel === "IVR" ? (
        <>
          {console.log("component called")}
          <div className="rendering__component__on__language__select">
            <div className="rendering__component__on__language__select__container">
              <div className="language__specific__wait__time__container">
                <Box
                  component="form"
                  style={{ width: "100%" }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id={"waitTime-" + props.languageCode}
                    type="number"
                    label={"Wait gfhgh for " + props.lang + " language"}
                    variant="outlined"
                    value={waitTime}
                    onChange={(e) => {
                      saveValues(e, "IVR");
                      setNormalState((prev) => !prev);
                    }}
                    onWheel={(e) => e.target.blur()}
                    disabled={props.disableEditingWhileCreatingCamp}
                    required
                    error={
                      showError
                        ? parseInt(waitTime, 10) >= 0
                          ? false
                          : true
                        : false
                    }
                  />
                </Box>
              </div>
              <div style={{}} className={props.hideItemStyle} hideItem>
                <input
                  accept="audio/wav"
                  style={
                    showError && isError
                      ? {
                          border: "2px solid red",
                          justifyContent: "center",
                          display: "flex",
                          overflow: "hidden",
                        }
                      : {
                          justifyContent: "center",
                          display: "flex",
                          overflow: "hidden",
                        }
                  }
                  type="file"
                  class="custom-file-input"
                  name="lang_audio_file"
                  onChange={async (event) => {
                    setShowLoader(true);
                    await uploadFiles(
                      "lang_audio_file",
                      event,
                      event.currentTarget.files,
                      props.languageCode
                    );
                    setIsError(false);
                    setShowLoader(false);
                  }}
                  id={props.languageCode + "-Lang"}
                  required
                />
                {globalState.state.ivrCampFlowData.flow.lang_audio_file &&
                globalState.state.ivrCampFlowData.flow.lang_audio_file[
                  props.languageCode
                ] &&
                globalState.state.ivrCampFlowData.flow.lang_audio_file[
                  props.languageCode
                ] !== "" ? (
                  <>
                    <div
                      item
                      className="fileNames"
                      id={props.languageCode + "langAudioShow"}
                      style={{
                        border: ".2px solid black",
                        width: "200px",
                        fontSize: "10px",
                        wordWrap: "break-word",
                        paddingBottom: "3px",
                        margin: "auto",
                        marginBottom: "10px",
                      }}
                    >
                      {GetMainAudioFiles(props.languageCode, "LangAudioFile")}
                    </div>
                  </>
                ) : null}
                {showLoader && <CircularProgress />}
              </div>
            </div>
          </div>
        </>
      ) : (
        localStore.ivrCampFlowData.flow.channel === "USSD" && (
          <>
            <div className="rendering__component__on__language__select">
              <div className="rendering__component__on__language__select__container">
                <div className="language__specific__wait__time__container">
                  <Box
                    component="form"
                    style={{ width: "100%" }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id={"waitTime-" + props.languageCode}
                      type="input"
                      label={"Input key to choose " + props.lang }
                      variant="outlined"
                      value={ussdKey}
                      onChange={(e) => {
                        saveValues(e, "USSD");
                        setNormalState((prev) => !prev);
                      }}
                      onWheel={(e) => e.target.blur()}
                      disabled={props.disableEditingWhileCreatingCamp}
                      required
                      error={showError ? (ussdKey ? false : true) : false}
                    />
                  </Box>
                </div>
                <div style={{marginTop:"1rem"}} className={props.hideItemStyle} hideItem>
                <TextField
                    label={`Message Response for ${ussdKey} input key`}
                    multiline
                    rows={2}
                    variant="outlined"
                  // class="custom-file-input"
                  name="lang_audio_file"
                  onChange={(event) => handleUSSD(event.target.value)}
                  id={props.languageCode + "-Lang"}
                  required
                  error={showError && isError ? true:false}
                />
                  {/* <TextField
                    id="outlined-multiline-static"
                    label="Type Your Message here"
                    multiline
                    rows={2}
                    variant="outlined"
                    value={localStore.ivrCampFlowData.flow.main_file.ussd._E}
                    // onChange={(e) => handleUSSD(e.target.value)}
                    error={
                      showError
                        ? localStore.ivrCampFlowData.flow.main_file.ussd._E
                          ? false
                          : true
                        : false
                    }
                    style={{ width: "100%", marginTop:"1rem" }}
                  /> */}
                  {showLoader && <CircularProgress />}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};

export default RenderingComponentOnLanguageSelect;

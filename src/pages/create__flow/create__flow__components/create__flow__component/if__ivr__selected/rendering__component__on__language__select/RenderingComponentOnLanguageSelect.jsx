import React, { useContext, useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CommonContext } from "../../../../../../helpers/CommonContext";
import "./renderingcomponentonlanguageselect.css";
import { BsCheckCircle } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiPlayCircle, FiRefreshCcw } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { Howl } from "howler";

import config from "../../../../../../ApiConfig/Config";
import { store } from "../../../../../../store/store";
const RenderingComponentOnLanguageSelect = (props) => {
  
  let globalState = useContext(store);
  const { dispatch } = globalState;
  let localStore = globalState.state;
  const channel = globalState.state.ivrCampFlowData.flow.channel;
  console.log("language props ====>", props);
  const { dtmfTime, setDtmfTime } = useContext(CommonContext);

  const saveValues = (e) => {
    // console.log(e.target.value);
    props.setDtmfTime(e.target.value);
  };
  useEffect(() => {
    // console.log("dtmfTime", dtmfTime);
  }, [dtmfTime]);

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
    // return
    try {
      const uploadedFiles = await uploadMultipleFiles(files);
      console.log("%c ==FILES UPLOADED==", "background:yellow", uploadedFiles);
      let localStore = globalState.state;
      const localFileName = uploadedFiles.response;
      const serverFileName = uploadedFiles.key;

      //set origional and server name mapping in temp
      localStore.temp.uploads.push({
        l_name: localFileName,
        s_name: serverFileName,
      });

      if (target === "main_audio_file" || target === "thanks_audio_file") {
        const key = e.target.name;
        const dict = {};
        let oldStateFiles = "";
        // console.log("local", localStore)
        if (
          localStore.ivrCampFlowData.flow &&
          localStore.ivrCampFlowData.flow[target] &&
          localStore.ivrCampFlowData.flow[target][lang]
        ) {
          oldStateFiles = localStore.ivrCampFlowData.flow[target][lang] + ",";
        }

        console.log("oldState", oldStateFiles);
        // dict[lang] = oldStateFiles + uploadedFiles[0].key;
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
        // console.log("local", localStore)
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
        // const key = e.target.name;
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
          // console.log("this is level 2 audio file for language ", lang, " ---> ", uploadedFiles[0].key);
          // console.log('localStore', parent_dtmf, current_dtmf, localStore);
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
          // console.log("this is level 3 audio file for language ", lang, " ---> ", uploadedFiles[0].key);
          // console.log('localStore', parent_dtmf, current_dtmf, localStore);
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
    // const path = Configs.server.path + ':' + Configs.server.port + '' + Configs.api.multipleFileUpload;
    const path = config.server.path + ":" + "5000" + "" + "/bng/ui/uploadFile";

    // const path = 'http://35.154.125.150:5080/api/bng/zbp/uploadMultipleFile';
    // const path = 'http://35.154.125.150:5080/uploadMultipleFile';
    console.log("Path is", path);
    return await fetch(path, {
      // fetch('http://172.16.10.212:/api/bng/zbp/uploadMultipleFile',{
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("got response from file upload....", response);
        return response;
      })
      .catch((e) => {
        console.log("error in file upload", e);
      });
  }

  const playPauseAudio = (src) => {
    debugger;
    AudioClips(src);
  };

  function AudioClips() {
    debugger;
    // const [isPlaying, setIsPlaying] = useState(false);
    let isPlaying = false;

    // const soundPlay = () => {
    //     debugger;
    const sound = new Howl({
      src: globalState.state.ivrCampFlowData.flow.main_audio_file,
      html5: true,
    });

    if (isPlaying) {
      sound.pause();
      isPlaying = false;
    } else {
      sound.play();
      isPlaying = true;
    }
    //  }
    // function playPause () {

    //  }
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
              <span style={{ color: "darkgray" }}> {index + 1} - </span>
              {/* {globalState.state.temp.uploads.length > 0 ? globalState.state.temp.uploads.find(f => e === f.s_name) ? globalState.state.temp.uploads.find(f => e === f.s_name).l_name : e : e} */}
              {e}
              <BsCheckCircle size={15} className="checkedIcon" />
              <IoIosCloseCircleOutline
                className="checkedIcon"
                size={15}
                style={{ color: "red", cursor: "pointer" }}
              />
              <FiPlayCircle
                className="checkedIcon"
                size={15}
                id={globalState.state.ivrCampFlowData.flow.main_audio_file.en}
                onClick={() => playPauseAudio(e)}
                style={{
                  color: "purple",
                  cursor: "pointer",
                }}
              />
              <FiPauseCircle
                size={15}
                className="checkedIcon"
                id={globalState.state.ivrCampFlowData.flow.main_audio_file.en}
                onClick={() => playPauseAudio(e)}
                style={{ cursor: "pointer" }}
              />

              {/* <span className="m-t-10"> </span> */}
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
                    <span style={{ color: "darkgray" }}> {index + 1} - </span>
                    {/* {globalState.state.temp.uploads.length > 0 ? globalState.state.temp.uploads.find(f => e === f.s_name) ? globalState.state.temp.uploads.find(f => e === f.s_name).l_name : e : e} */}
                    {e}
                    <BsCheckCircle size={15} className="checkedIcon" />
                    <IoIosCloseCircleOutline
                      className="checkedIcon"
                      size={15}
                      style={{
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                    <FiPlayCircle
                      className="checkedIcon"
                      size={15}
                      id={
                        globalState.state.ivrCampFlowData.flow.language[0]
                          .actions[i].lang_file["ivr"][lang]
                      }
                      onClick={() => playPauseAudio(e)}
                      style={{
                        color: "purple",
                        cursor: "pointer",
                      }}
                    />
                    <FiPauseCircle
                      size={15}
                      className="checkedIcon"
                      id={
                        globalState.state.ivrCampFlowData.flow.language[0]
                          .actions[i].lang_file["ivr"][lang]
                      }
                      onClick={() => playPauseAudio(e)}
                      style={{ cursor: "pointer" }}
                    />
                    <br></br>
                    <br></br>
                    {/* <span className="m-t-10"> </span> */}
                  </span>
                );
              });
        }
      }
    }

    return <span> {Filelist} </span>;
  };

  return (
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
                id="if__IVR__selected"
                type="number"
                label={"Wait time for " + props.lang + " language"}
                variant="outlined"
                // value={props.languageCode == '_E'
                // ? globalState.state
                //       .ivrCampFlowData
                //       .flow.language[0]
                //       .actions[0]
                //       .waitTime
                // : props.languageCode == '_H'
                // ? globalState.state
                //       .ivrCampFlowData
                //       .flow.language[0]
                //       .actions[1]
                //       .waitTime
                // : props.languageCode == '_S'
                // ? globalState.state
                //       .ivrCampFlowData
                //       .flow.language[0]
                //       .actions[2]
                //       .waitTime
                // : globalState.state
                //       .ivrCampFlowData
                //       .flow.language[0]
                //       .actions[3]
                //       .waitTime}
                value={props.dtmfTime}
                onChange={saveValues}
              />
            </Box>
          </div>

          {/* {localStore.ivrCampFlowData.flow.languageChange.map((lang) => ( */}
          {/* {globalState.state.ivrCampFlowData.flow.languageChange.length > 1 &&
            globalState.state.ivrCampFlowData.flow.languageChange.map(
              (lang) => ( */}
          <div
            style={{ border: "2px solid red" }}
            className={props.hideItemStyle}
            hideItem
          >
            <input
              accept="audio/mp3"
              type="file"
              class="custom-file-input"
              name="lang_audio_file"
              onChange={(event) => {
                uploadFiles(
                  "lang_audio_file",
                  event,
                  event.currentTarget.files,
                  props.languageCode
                );
              }}
              id={props.languageCode + "-Lang"}
            />
            {globalState.state.ivrCampFlowData.flow.lang_audio_file &&
            globalState.state.ivrCampFlowData.flow.lang_audio_file[
              props.languageCode
            ] &&
            globalState.state.ivrCampFlowData.flow.lang_audio_file[
              props.languageCode
            ] !== "" ? (
              <>
                <br></br>
                {/* show all the audio files uploaded */}
                <div
                  item
                  className="fileNames"
                  id={props.languageCode + "langAudioShow"}
                >
                  {GetMainAudioFiles(props.languageCode, "LangAudioFile")}
                </div>
              </>
            ) : null}
          </div>
          {/* )
            )} */}
          {/* ))}  */}
        </div>
      </div>
    </>
  );
};

export default RenderingComponentOnLanguageSelect;

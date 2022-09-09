import React, { useState, useEffect, useContext, createContext } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import "./ifivrselected.css";
import classNames from "classnames";

import MainDTMF from "./main__dtmf/MainDTMF";
import { CommonContext } from "../../../../../helpers/CommonContext";
import { store } from "../../../../../store/store";

import { findAndModifyFirst } from "obj-traverse/lib/obj-traverse";

import config from "../../../../../ApiConfig/Config";
import Typography from "@mui/material/Typography";
import ReactAudioPlayer from 'react-audio-player';

import { BsCheckCircle } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiPlayCircle, FiRefreshCcw } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { Howl } from "howler";
import { useError } from "../../../../../store/errorContext";
import { FileUploaderForIVRSelected } from "../../../../../components/fileUpload/FileUploaderForIVRSelected";

const IfIVRSelected = (props) => {
  debugger;
  const {
    welcomePromptWaitTime,
    setWelcomePromptWaitTime,
    numberOfMainDTMFWhenIVRIsSelected,
    setnumberOfMainDTMFWhenIVRIsSelected,
  } = useContext(CommonContext);

  const [data, setData] = useState({
    dtmf: 0,
    playOption: "PLAY",
  });

  let globalState = useContext(store);
  const { dispatch } = globalState;
  const {showError, setShowError, errorDispatch, errorState} = useError()
  let localStore = globalState.state;
  const channel = globalState.state.ivrCampFlowData.flow.channel;
  const [disableChannel, setDisableChannel] = useState(channel);

  useEffect(()=>{
    setShowError(false)
    errorDispatch({type: 'IF_IVR_SELECTED', payload: false})
  },[])
  
  useEffect(()=>{
    if(parseInt(globalState.state.ivrCampFlowData.flow.waitTime) >=0 && parseInt(globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount) >=0){
      errorDispatch({type: 'IF_IVR_SELECTED', payload: true})
    }
    else{
      errorDispatch({type: 'IF_IVR_SELECTED', payload: false})
      
    }
  },[globalState.state.ivrCampFlowData.flow.waitTime, globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount])

  const handleDataInput = (e, type) => {
    if (type === "mainAudioWaitTime") {
      localStore.ivrCampFlowData.flow["waitTime"] = e.target.value;
    }
    dispatch({ type: "SET_DATA", nState: localStore });
  };

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
    const path = config.server.path + ":" + "5002" + "" + "/bng/ui/uploadFile";

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
        errorDispatch({type:'AUDIO', payload: false})
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
    if (type == "MainAudioFile") {
      console.log("getMainAudio", type);
      var Filelist = globalState.state.ivrCampFlowData.flow.main_audio_file[
        id[0]
      ]
        .split(",")
        .map((e, index) => {
          return (
            <span
              // style={{ border: "2px solid green", marginTop:"-10px"}}
              key={e}
            >
              <span style={{ color: "darkgray" }}>
                {/* {" "} */}
                {index + 1} - {e}
              </span>{" "}
              <br />
              {/* {globalState.state.temp.uploads.length > 0 ? globalState.state.temp.uploads.find(f => e === f.s_name) ? globalState.state.temp.uploads.find(f => e === f.s_name).l_name : e : e} */}
              {/* {e} */}
              <div
                className="playingOptions"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "5px",
                }}
              >
                {/* <BsCheckCircle size={15} className="checkedIcon" />
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
                /> */}

<ReactAudioPlayer
                src={e}
                autoPlay
                controls
              />
              </div>
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
                    {/* <BsCheckCircle size={15} className="checkedIcon" />
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
                    /> */}
                    <ReactAudioPlayer
                src={e}
                autoPlay
                controls
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

  const handleDataChange = (e) => {
    debugger;

    const key = e.target.name;
    if (key === "main_audio_dtmfCount") {
      localStore.ivrCampFlowData.flow[key] = e.target.value;
      dispatch({ type: "SET_DTMF_MAIN", nState: localStore });
    }
    console.log(
      "%c== local STORE ==",
      "background:lightblue; font-size:1.3rem",
      localStore
    );
  };

  const detectLevel = (e, target, current) => {
    debugger;
    handleChange(e);
    // console.log('dtmfs--- options', props, e, target, current)
    if (target === "main_audio") {
      handleDataChange(e);
    } else if (target === "sub_audio_dtmfs") {
      setDataDynamic("sub_audio_dtmfs", e, current);
    } else {
      let oldNumOfCards = 0;
      const newNumOfCards = e.target.value;

      if (current && current.dtmf_count) {
        oldNumOfCards = current.dtmf_count;
      }

      console.log(
        "globalState.state.ivrCampFlowData.flow ",
        localStore.ivrCampFlowData.flow,
        "CURRENT.... ",
        current
      );
      console.log(
        "OLD NUMBER OF CARDS.... ",
        oldNumOfCards,
        "NEW NUMBER OF CARDS.... ",
        newNumOfCards
      );

      if (newNumOfCards >= oldNumOfCards) {
        debugger;
        let languageSelect = {};
        localStore.ivrCampFlowData.flow.languageChange.map((e) => {
          languageSelect[e] = "";
        });
        genArray(newNumOfCards - oldNumOfCards).map((e) => {
          e = oldNumOfCards + e;
          console.log(
            "%c......PUSH.....",
            "background: 'pink'; 'font-size: 1.5rem",
            e
          );
          localStore.ivrCampFlowData.flow.actions[current.id - 1].actions.push({
            dtmf_key: e,
            parent_dtmf: current.dtmf_key,
            audio_file: {},
            action_tag: "",
            sms: "",
            file: {
              ivr: languageSelect,
              sms: languageSelect,
            },
            node_type: "PROCESSING",
            input: {
              ivr_key: e,
              sms_key: "",
            },
            actionType: {
              ivr: "",
              sms: "",
            },
            type: "PLAY",
            level: current.level + 1,
            waitTime: 0,
            url: "",
            actions: [
              {
                dtmf_key: 1,
                parent_dtmf: e,
                type: "HITURL",
                level: current.level + 2,
                action_tag: "",
                sms: "",
                file: {
                  ivr: languageSelect,
                  sms: languageSelect,
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 1,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                url: "",
                parameter: "auto=true",
                url_actions: [],
                id: current.id + "_" + e + "_" + 1,
              },
              {
                dtmf_key: 2,
                parent_dtmf: e,
                type: "HITURL",
                action_tag: "",
                sms: "",
                file: {
                  ivr: languageSelect,
                  sms: languageSelect,
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 2,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                level: current.level + 2,
                url: "",
                parameter: "auto=false",
                url_actions: [],
                id: current.id + "_" + e + "_" + 2,
              },
            ],
            id: current.id + "_" + e,
            repeat: {
              value: false,
              dtmf: 0,
              audio_file: [],
              max_count: 0,
            },
          });
        });
      } else {
        for (var i = 0; i < oldNumOfCards - newNumOfCards; i++)
          localStore.ivrCampFlowData.flow.actions[current.id - 1].actions.pop();
      }

      // // dispatch('SET_DTMF_SUB', data)
      localStore.ivrCampFlowData.flow.actions[current.id - 1].dtmf_count =
        newNumOfCards;
      dispatch({ type: "SET_DATA", nState: localStore });

      //TO-DO : Write using SET_DTMF_SUB
    }
  };

  const setDataDynamic = (type, e, current) => {
    debugger;

    const val = e.target.value;
    let localStore = globalState.state;
    // console.log(current, e.target.value, props);

    if (type === "sub_audio_dtmfs") {
      if (current.level === 1) {
        //for level 1
        console.log("===================================================");

        const oldNumOfCards =
          localStore.ivrCampFlowData.flow.actions[current.dtmf_key - 1]
            .dtmf_count;
        const newNumOfCards = e.target.value;

        localStore.ivrCampFlowData.flow.actions[
          current.dtmf_key - 1
        ].dtmf_count = e.target.value;
        console.log("---------", localStore);

        if (newNumOfCards > oldNumOfCards) {
          let languageSelect = {};
          localStore.ivrCampFlowData.flow.languageChange.map((e) => {
            languageSelect[e] = "";
          });
          console.log(languageSelect);
          genArray(newNumOfCards - oldNumOfCards).map((e) => {
            localStore.ivrCampFlowData.flow.actions[
              current.dtmf_key - 1
            ].actions.push({
              dtmf_key: oldNumOfCards + e,
              audio_file: {},
              parent_dtmf: current.dtmf_key,
              type: "PLAY",
              level: current.level + 1,
              waitTime: "",
              url: "",
              dtmf_count: 0,
              actions:
                current.type === "PLAY"
                  ? []
                  : [
                      {
                        dtmf_key: 1,
                        parent_dtmf: e,
                        type: "HITURL",
                        level: current.level + 2,
                        action_tag: "",
                        sms: "",
                        file: {
                          ivr: languageSelect,
                          sms: languageSelect,
                        },
                        node_type: "PROCESSING",
                        input: {
                          ivr_key: 1,
                          sms_key: "",
                        },
                        actionType: {
                          ivr: "",
                          sms: "",
                        },
                        url: "",
                        parameter: "auto=true",
                        url_actions: [],
                        id: current.id + "_" + e + "_" + 1,
                      },
                      {
                        dtmf_key: 2,
                        parent_dtmf: e,
                        type: "HITURL",
                        action_tag: "",
                        sms: "",
                        file: {
                          ivr: languageSelect,
                          sms: languageSelect,
                        },
                        node_type: "PROCESSING",
                        input: {
                          ivr_key: 2,
                          sms_key: "",
                        },
                        actionType: {
                          ivr: "",
                          sms: "",
                        },
                        level: current.level + 2,
                        url: "",
                        parameter: "auto=false",
                        url_actions: [],
                        id: current.id + "_" + e + "_" + 2,
                      },
                    ],
              action_tag: "",
              sms: "",
              file: {
                ivr: languageSelect,
                sms: languageSelect,
              },
              node_type: "PROCESSING",
              input: {
                ivr_key: oldNumOfCards + e,
                sms_key: "",
              },
              actionType: {
                ivr: "",
                sms: "",
              },
              id: `${current.id}_${oldNumOfCards + e}`,
              repeat: {
                value: false,
                dtmf: 0,
                audio_file: [],
                max_count: 0,
              },
            });
          });
        } else {
          //delete cards from the end of the array
          for (var i = 0; i < oldNumOfCards - newNumOfCards; i++)
            localStore.ivrCampFlowData.flow.actions[
              current.dtmf_key - 1
            ].actions.pop();
        }
      }
      if (current.level === 2) {
        //for level 2
        let levels = current.id.split("_").map((e) => parseInt(e) - 1);
        console.log(
          "========================222===========================",
          levels
        );

        const oldNumOfCards =
          localStore.ivrCampFlowData.flow.actions[levels[0]].actions[levels[1]]
            .actions.length > 0
            ? localStore.ivrCampFlowData.flow.actions[levels[0]].actions[
                levels[1]
              ].dtmf_count
            : 0;
        const newNumOfCards = e.target.value;
        console.log("---------", oldNumOfCards, newNumOfCards, localStore);

        localStore.ivrCampFlowData.flow.actions[levels[0]].actions[
          levels[1]
        ].dtmf_count = e.target.value;

        if (newNumOfCards > oldNumOfCards) {
          debugger;
          let languageSelect = {};
          localStore.ivrCampFlowData.flow.languageChange.map((e) => {
            languageSelect[e] = "";
          });
          genArray(newNumOfCards - oldNumOfCards).map((e) => {
            localStore.ivrCampFlowData.flow.actions[levels[0]].actions[
              levels[1]
            ].actions.push({
              dtmf_key: oldNumOfCards + e,
              audio_file: {},
              parent_dtmf: current.dtmf_key,
              type: "PLAY",
              level: current.level + 1,
              waitTime: "",
              url: "",
              dtmf_count: 0,
              actions: [
                {
                  dtmf_key: 1,
                  parent_dtmf: e,
                  type: "HITURL",
                  level: current.level + 2,
                  action_tag: "",
                  sms: "",
                  file: {
                    ivr: languageSelect,
                    sms: languageSelect,
                  },
                  node_type: "PROCESSING",
                  input: {
                    ivr_key: 1,
                    sms_key: "",
                  },
                  actionType: {
                    ivr: "",
                    sms: "",
                  },
                  url: "",
                  parameter: "auto=true",
                  url_actions: [],
                  id: current.id + "_" + e + "_" + 1,
                },
                {
                  dtmf_key: 2,
                  parent_dtmf: e,
                  type: "HITURL",
                  action_tag: "",
                  sms: "",
                  file: {
                    ivr: languageSelect,
                    sms: languageSelect,
                  },
                  node_type: "PROCESSING",
                  input: {
                    ivr_key: 2,
                    sms_key: "",
                  },
                  actionType: {
                    ivr: "",
                    sms: "",
                  },
                  level: current.level + 2,
                  url: "",
                  parameter: "auto=false",
                  url_actions: [],
                  id: current.id + "_" + e + "_" + 2,
                },
              ],
              action_tag: "",
              sms: "",
              file: {
                ivr: languageSelect,
                sms: languageSelect,
              },
              node_type: "PROCESSING",
              input: {
                ivr_key: oldNumOfCards + e,
                sms_key: "",
              },
              actionType: {
                ivr: "",
                sms: "",
              },
              id: `${current.id}_${oldNumOfCards + e}`,
              repeat: {
                value: false,
                dtmf: 0,
                audio_file: [],
                max_count: 0,
              },
            });
          });
        } else {
          //delete cards from the end of the array
          for (var i = 0; i < oldNumOfCards - newNumOfCards; i++)
            localStore.ivrCampFlowData.flow.actions[levels[0]].actions[
              levels[1]
            ].actions.pop();
        }
      }

      console.log("---------", localStore);
      dispatch({ type: "SET_DATA", nState: localStore });
    }
  };

  const genArray = (n) => {
    return Array(n)
      .fill()
      .map((x, i) => i + 1);
  };

  const handleChange = (event) => {
    setnumberOfMainDTMFWhenIVRIsSelected(event.target.value);
    return;
  };

  const dataHandleWithObj = (e, obj) => {
    debugger;
    console.log("change dtmf type", e, obj);
    const key = e.target.name;
    let localStore = globalState.state;
    // localStore.ivrCampFlowData.flow[key] = e.target.value;

    if (key === "type") {
      if (obj.parent_dtmf) {
        obj.type = e.target.value;
        // console.log("%cKEY level 2", 'color:green', "key", key, "ew", e, obj, localStore)

        if (obj.level === 3) {
          let levels = obj.id.split("_").map((e) => parseInt(e) - 1);
          localStore.ivrCampFlowData.flow.actions[levels[0]].actions[
            levels[1]
          ].actions[levels[2]] = obj;
        } else {
          localStore.ivrCampFlowData.flow.actions[obj.parent_dtmf - 1].actions[
            obj.dtmf_key - 1
          ] = obj;
        }
        console.log(
          "%cKEY level 2",
          "color:green",
          "key",
          key,
          "ew",
          e,
          obj,
          localStore
        );
        dispatch({ type: "SET_DATA", nState: localStore });
      } else {
        console.log(disableChannel);
        if (disableChannel == "IVR") {
          obj.actionType.ivr = e.target.value;
          console.log(obj.actionType.ivr);
          obj.actionType.sms = "";
        } else if (disableChannel == "SMS") {
          obj.actionType.ivr = "";
          obj.actionType.sms = e.target.value;
        } else if (disableChannel == "IVR_SMS") {
          if (e.target.value == "PLAY/SCHEDULE_SMS") {
            obj.actionType.ivr = "PLAY";
            obj.actionType.sms = "SCHEDULE_SMS";
          }
          if (e.target.value == "PLAY/HITURL_SMS") {
            obj.actionType.ivr = "PLAY";
            obj.actionType.sms = "HITURL_SMS";
          }
          if (e.target.value == "SCHEDULE_SMS/HITURL_SMS") {
            obj.actionType.ivr = "SCHEDULE_SMS";
            obj.actionType.sms = "HITURL_SMS";
          }
          if (e.target.value == "SCHEDULE_SMS/SCHEDULE_SMS") {
            obj.actionType.ivr = "SCHEDULE_SMS";
            obj.actionType.sms = "SCHEDULE_SMS";
          }
        }
        obj.type = e.target.value;
        localStore.ivrCampFlowData.flow.actions[obj.dtmf_key - 1] = obj;
        console.log(
          "%cKEY level 1",
          "color:green",
          "key",
          key,
          "ew",
          e,
          obj,
          localStore
        );
        dispatch({ type: "SET_DATA", nState: localStore });
      }
    }
  };

  const setWaitTime = (level, target, dtmf_key) => {
    const val = target.value >= 0 ? target.value :0
    let localStore = globalState.state;
    if (level === "main") localStore.ivrCampFlowData.flow.waitTime = val;
    else if (level === "sub")
      localStore.ivrCampFlowData.flow.actions[dtmf_key - 1].waitTime = val;

    console.log("localStore.ivrCampFlowData = ", localStore.ivrCampFlowData);
    dispatch({ type: "SET_DATA", nState: localStore });
  };
  const [arr1, setArr] = useState([]);
  useEffect(() => {
    localStorage.setItem("colorStateCounter", 1);
    var arr = [];
    for (var i = 1; i < numberOfMainDTMFWhenIVRIsSelected + 1; i++) {
      arr.push(i);
    }
    setArr(arr);
  }, [numberOfMainDTMFWhenIVRIsSelected]);

  const numberOfDTMF = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  // const howManyDTMFToShow = (numberOfMainDTMFWhenIVRIsSelected) => {

  // };
  var hellohello = [];
  var languageName = [];
  return (
    <>
      <div className="if__ivr__selected">
        <div className="if__ivr__selected__container">
          <hr className="hr" />
          <div
            style={{boxShadow:"2px 2px 3px grey"}}
            className={props.hideItemStyle}
          >
            {localStore.ivrCampFlowData.flow.language.map((hello) => {
              console.log(
                "localStore.ivrCampFlowData.flow.language ===>",
                hello
              );
              hellohello.push(hello.actions);
              hello.actions.forEach((el) => {
                console.log("action element ===>", el.languageName);
                languageName.push(el.languageName);
              });
              console.log(
                "localStore.ivrCampFlowData.flow.language hello ===>",
                hellohello
              );
            })}
            <div className="ghghg" style={{ margin:"10px 0"}}>
              {languageName.map((el) => {
                return <Typography style={{fontSize:"12px"}}>enter hello file for {el}</Typography>;
              })}
            </div>
            <div className="ghghgh" style={{ }}>
              {localStore.ivrCampFlowData.flow.languageChange.map((lang) => (
                  <FileUploaderForIVRSelected lang={lang} GetMainAudioFiles={GetMainAudioFiles} localStore={localStore} uploadFiles={uploadFiles} hideItemStyle={props.hideItemStyle} />

              ))}
            </div>
          </div>

          <div className="main__wait__time__and__dtmf__container">
            <div className="main__wait__time__container">
              <Box
                component="form"
                style={{ width: "80%" }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id={"waitTime_" + global.dtmf_key}
                  disabled={
                    // disableProperties &&
                    disableChannel == "SMS" ||
                    // !disableProperties &&
                    disableChannel == "SMS" ||
                    props.disableEditingWhileCreatingCamp
                  }
                  label="Welcome prompt Wait Time"
                  type="number"
                  name={"waitTime_" + global.dtmf_key}
                  // value={welcomePromptWaitTime}
                  value={globalState.state.ivrCampFlowData.flow.waitTime}
                  // onChange={(e) => {
                  //   // setWelcomePromptWaitTime(e.target.value);
                  //   handleDataInput(e, "mainAudioWaitTime");
                  // }}
                  onChange={(e) => setWaitTime("main", e.target, null)}
                  onWheel={(e) => e.target.blur()}
                  variant="outlined"
                  required
                  error={showError ? parseInt(globalState.state.ivrCampFlowData.flow.waitTime, 10) >=0 ? false : true :false}
                />
              </Box>
            </div>
            <div className="main__dtms__container">
              <FormControl style={{ width: "80%" }}>
                <InputLabel id="demo-simple-select-label" required error={showError ? globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount ? false : true :false}>
                  {" "}
                  hello DTMF
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    globalState.state.ivrCampFlowData.flow
                      .main_audio_dtmfCount || null
                  }
                  label="DTMF"
                  // onChange={handleChange}
                  onChange={(e) => {
                    detectLevel(e, "main_audio");
                    console.log(e.target);
                    console.log("here");
                  }}
                  name="main_audio_dtmfCount"
                  disabled={props.disableEditingWhileCreatingCamp}
                  required
                  error={showError ? globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount ? false : true :false}
                >
                  {numberOfDTMF.map((number, index) => {
                    return (
                      <MenuItem value={number} name={"main_audio_dtmfCount"}>
                        {number}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            {/* {howManyDTMFToShow(numberOfMainDTMFWhenIVRIsSelected)} */}
          </div>

          <div className="ifIVRselected__number__of__DTMF__to__show__container">
            {genArray(
              globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount ||
                data.dtmf
            ).map((e, index) => {
              return (
                <MainDTMF
                  data={e}
                  parentNode={"main_audio"}
                  global={globalState.state.ivrCampFlowData.flow.actions[e - 1]}
                  mainData={data}
                  handleDataChange={handleDataChange}
                  onChange={handleChange}
                  globalState={globalState}
                  dtmfNumber={e}
                  setDataDynamic={setDataDynamic}
                  dataHandleWithObj={dataHandleWithObj}
                  setWaitTime={setWaitTime}
                  hideItemStyle={props.hideItemStyle}
                  disableEditingWhileCreatingCamp={
                    props.disableEditingWhileCreatingCamp
                  }
                  // edit={props.edit}
                  // uploadFiles={uploadFiles}
                  // setRepeat={setRepeat}
                  // setDataCust={setDataCust}
                  // disableProperties={disableProperties}
                  // resetFileArray={resetFileArray}
                  // disableChannel={disableChannel}
                  />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default IfIVRSelected;

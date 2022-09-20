import React, { useState, useEffect, useContext } from "react";

import "./subdtmf.css";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { findAndModifyFirst } from "obj-traverse/lib/obj-traverse";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { store } from "../../../../../../store/store";

import { BsCheckCircle } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiPlayCircle, FiRefreshCcw } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { Howl } from "howler";
import ReactAudioPlayer from "react-audio-player";

import config from "../../../../../../ApiConfig/Config";
import { useError } from "../../../../../../store/errorContext";
import { FileUploaderForSubDTMF } from "../../../../../../components/fileUpload/FileUploaderForSubDTMF";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const numberOfSubDTMF = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

const SubDTMF = (props) => {
  // const { current } = props.current;

  var hellohello = [];
  var languageName = [];
  const { showError, setShowError, errorDispatch } = useError();
  const [expanded, setExpanded] = React.useState(true);
  const [
    numberOfMainDTMFWhenIVRIsSelected,
    setnumberOfMainDTMFWhenIVRIsSelected,
  ] = React.useState("");

  const [selectOptionForMainDTMF, setSelectOptionForMainDTMF] =
    React.useState("");
  const [isFilled, setIsFilled] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChange = (event) => {
    setnumberOfMainDTMFWhenIVRIsSelected(event.target.value);
    // setSelectOptionForMainDTMF(event.target.value);
  };
  const handleDtmfOptionChange = (event) => {
    // setnumberOfMainDTMFWhenIVRIsSelected(event.target.value);
    setSelectOptionForMainDTMF(event.target.value);
  };

  const uploadFiles = async (target, e, files, lang, current) => {
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
          localStore.ivrCampFlowData.flow[target]
        ) {
          oldStateFiles = localStore.ivrCampFlowData.flow[target][lang] + ",";
        }

        console.log("oldState", oldStateFiles);
        dict[lang] = oldStateFiles + uploadedFiles[0].key;
        localStore.ivrCampFlowData.flow[key] = {
          ...localStore.ivrCampFlowData.flow[key],
          ...dict,
        };
        localStore.ivrCampFlowData.flow["type"] = "PLAY";
        dispatch({ type: "SET_MAIN_AUDIO_FILE", nState: localStore });
      } else if (target === "repeat_audio_file") {
        // const key = e.target.name;
        const dict = {};
        dict[lang] = uploadedFiles[0].key;
        let localStoreB = localStore.ivrCampFlowData.flow;
        let localStoreC = localStore.ivrCampFlowData.flow;
        let traverseArr = current.id.split("_");
        for (let i = 0; i < traverseArr.length; i++) {
          localStoreC = localStoreC.actions[traverseArr[i] - 1];
        }
        localStoreC.repeat.audio_file = dict;
        findAndModifyFirst(
          localStoreB,
          "actions",
          { id: props.current.id },
          localStoreC
        );
        localStore.ivrCampFlowData.flow = localStoreB;
        dispatch({ type: "SET_DATA", nState: localStore });
      } else {
        const targetArray = target.split("_");
        console.log(target, "......", targetArray);

        let previousData = traverseAndModify(
          props.current.id,
          props.current,
          null,
          null,
          "return"
        );
        // }
        previousData.audio_file[lang] = previousData.audio_file[lang]
          ? previousData.audio_file[lang] + "," + uploadedFiles.response
          : uploadedFiles.response;
        previousData.file["ivr"][lang] = previousData.file["ivr"][lang]
          ? previousData.file["ivr"][lang] + "," + uploadedFiles.response
          : uploadedFiles.response;
        localStore = findAndModifyFirst(
          localStore,
          "actions",
          { id: props.current.id },
          previousData,
          "edit"
        );

        dispatch({ type: "SET_DATA", nState: localStore });
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
        errorDispatch({ type: "AUDIO", payload: false });
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
            <span key={e}>
              <span style={{ color: "darkgray" }}> {index + 1} - </span>
              {/* {globalState.state.temp.uploads.length > 0 ? globalState.state.temp.uploads.find(f => e === f.s_name) ? globalState.state.temp.uploads.find(f => e === f.s_name).l_name : e : e} */}
              {e}
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
                src={`http://34.214.61.86/cm_data/audio/${e}`}
                // autoPlay
                controls
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
                      src={`http://34.214.61.86/cm_data/audio/${e}`}
                      // autoPlay
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

  const globalState = useContext(store);
  let localStore = globalState.state;
  const { disableChannel } = props;
  console.log("dtmfs options  hello", props);
  // const { fileuploadclick } = props;

  const { dispatch } = globalState;

  const genArray = (n) => {
    return Array(n)
      .fill()
      .map((x, i) => i + 1);
  };

  const setDataDynamic = (type, e, current) => {
    debugger;
    const val = e.target.value;
    let localStore = globalState.state;
    console.log(current, e.target.value, props);
    console.log("===================================================");

    // const oldNumOfCards = localStore.ivrCampFlowData.flow.actions[current.dtmf_key - 1].dtmf_count;
    const oldNumOfCards = traverseAndModify(
      current.id,
      current,
      "dtmf_count",
      null,
      "read"
    );
    const newNumOfCards = e.target.value;

    // localStore.ivrCampFlowData.flow.actions[current.dtmf_key - 1].dtmf_count = e.target.value;
    traverseAndModify(
      current.id,
      current,
      "dtmf_count",
      e.target.value,
      "edit"
    );

    console.log("---------", localStore);
    let childActions = traverseAndModify(
      current.id,
      null,
      null,
      null,
      "return"
    ).actions;
    console.log("---------", localStore, "childdddddddd", childActions);
    if (newNumOfCards > oldNumOfCards) {
      debugger;
      let languageSelect = {};
      localStore.ivrCampFlowData.flow.languageChange.map((e) => {
        languageSelect[e] = "";
      });
      genArray(newNumOfCards - oldNumOfCards).forEach((e) => {
        childActions.push({
          dtmf_key: oldNumOfCards + e,
          audio_file: {},
          parent_dtmf: current.dtmf_key,
          type: "PLAY",
          level: current.level + 1,
          waitTime: "",
          url: "",
          url_success: "",
          url_fail: "",
          url_action: "",
          dtmf_count: 0,
          actions: [
            //     //    { true ?
            //     //     {
            //     //        hit_url: 'yo'
            //     // }:
            //     // ''
            // }
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
        childActions.pop();
    }
    console.log("---------", localStore);
    traverseAndModify(current.id, current, "actions", childActions, "edit");
  };

  const detectLevel = (e, target, current) => {
    debugger;
    handleChange(e);
    console.log("dtmfs--- options", props, e, target, current);
    if (target === "main_audio") {
      props.handleDataChange(e);
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

  function traverseAndModify(id, objToTraverse, keyToChange, value, type) {
    debugger;
    console.log(
      "traverse and modify",
      id,
      objToTraverse,
      keyToChange,
      value,
      "changetype",
      type
    );
    if (value == "HITURL") {
      setDataDynamicHitUrl(props.current.id, props.current);
    }
    if (
      props.current.type == "HITURL" &&
      (value == "PLAY" || value == "NODTMF" || value == "DIGITCOLLECT")
    ) {
      traverseAndModify(props.current.id, props.current, "actions", [], "edit");
    }

    let traverseArr = id.split("_");
    let localStore = globalState.state;
    let localStoreB = globalState.state.ivrCampFlowData.flow;
    let localStoreC = globalState.state.ivrCampFlowData.flow;
    console.log("----", traverseArr);

    for (let i = 0; i < traverseArr.length; i++) {
      localStoreC = localStoreC.actions[traverseArr[i] - 1];
      console.log("----", localStoreC);
    }

    if (type === "read") {
      debugger;
      if (keyToChange == "sms") {
        let id = value.split("-");
        return localStoreC.file["sms"][id[1]];
      }
      if (keyToChange == "input.sms_key") {
        return localStoreC.input.sms_key;
      }
      console.log("readingg---....", localStoreC);
      return localStoreC[keyToChange];
    }
    if (type === "return") {
      console.log("return---....", localStoreC);
      return localStoreC;
    }

    // save the value
    if (keyToChange == "audio_file") {
      delete localStoreC.audio_file[value];
      localStoreC.file["ivr"][value] = "";
    } else if (keyToChange == "repeat" && type == "edit") {
      localStoreC.repeat[value.target.name] = value.target.value;
    } else if (keyToChange == "repeat_dtmf_sub" && type == "edit") {
      localStoreC.repeat.dtmf = value.value;
    } else if (keyToChange == "repeat_dtmf_count" && type == "edit") {
      localStoreC.repeat.max_count = value.value;
    } else if (keyToChange == "repeatCheck" && type == "edit") {
      localStoreC.repeat.value = value.value == "false" ? true : false;
    } else if (keyToChange == "sms_key" && type == "edit") {
      localStoreC.input.sms_key = value;
    } else if (keyToChange == "sms" && type == "edit") {
      let id = value.target.id.split("-");
      localStoreC.file["sms"][id[1]] = value.target.value;
      localStoreC.sms = value.target.value;
    } else if (keyToChange == "type" && type == "edit") {
      if (disableChannel == "IVR") {
        localStoreC.actionType.ivr = value;
        localStoreC.actionType.sms = "";
      } else if (disableChannel == "SMS") {
        localStoreC.actionType.ivr = "";
        localStoreC.actionType.sms = value;
      } else if (disableChannel == "IVR_SMS") {
        if (value == "PLAY/SCHEDULE_SMS") {
          localStoreC.actionType.ivr = "PLAY";
          localStoreC.actionType.sms = "SCHEDULE_SMS";
        }
        if (value == "PLAY/HITURL_SMS") {
          localStoreC.actionType.ivr = "PLAY";
          localStoreC.actionType.sms = "HITURL_SMS";
        }
        if (value == "SCHEDULE_SMS/HITURL_SMS") {
          localStoreC.actionType.ivr = "SCHEDULE_SMS";
          localStoreC.actionType.sms = "HITURL_SMS";
        }
        if (value == "SCHEDULE_SMS/SCHEDULE_SMS") {
          localStoreC.actionType.ivr = "SCHEDULE_SMS";
          localStoreC.actionType.sms = "SCHEDULE_SMS";
        }
      }
      localStoreC.type = value;
    } else {
      localStoreC[keyToChange] = value;
    }

    findAndModifyFirst(localStoreB, "actions", { id: id }, localStoreC);
    localStore.ivrCampFlowData.flow = localStoreB;

    // console.log("******", localStore);
    dispatch({ type: "SET_DATA", nState: localStore });
  }

  const setDataDynamicHitUrl = (id, current) => {
    let childActions = traverseAndModify(
      current.id,
      null,
      null,
      null,
      "return"
    ).actions;
    childActions.push(
      {
        dtmf_key: 1,
        audio_file: {},
        parent_dtmf: current.dtmf_key,
        type: "PLAY",
        level: current.level + 1,
        waitTime: "",
        url: "",
        url_success: "",
        url_fail: "",
        url_action: "",
        dtmf_count: 0,
        actions: [],
        action_tag: "",
        sms: "",
        file: {
          ivr: {
            en: "",
          },
          sms: {
            en: "",
          },
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
        id: `${current.id}_1`,
        repeat: {
          value: false,
          dtmf: 0,
          audio_file: [],
        },
      },
      {
        dtmf_key: 2,
        audio_file: {},
        parent_dtmf: current.dtmf_key,
        type: "PLAY",
        level: current.level + 1,
        waitTime: "",
        url: "",
        url_success: "",
        url_fail: "",
        url_action: "",
        dtmf_count: 0,
        actions: [],
        action_tag: "",
        sms: "",
        file: {
          ivr: {
            en: "",
          },
          sms: {
            en: "",
          },
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
        id: `${current.id}_2`,
        repeat: {
          value: false,
          dtmf: 0,
          audio_file: [],
        },
      }
    );
    traverseAndModify(current.id, current, "actions", childActions, "edit");
  };

  const [arr1, setArr] = useState([]);

  const [bgCounterState, setBgCounterState] = useState(1);

  const AudioFilesL2 = (props) => {
    console.log("audiofileprops", props);
    // const Filelist = globalState.state.ivrCampFlowData.flow.actions[props.parentDtmf].actions[props.currDtmf].audio_file[props.lang].split(',').map((e, index) => {
    const Filelist = traverseAndModify(
      props.current.id,
      null,
      null,
      null,
      "return"
    )
      .audio_file[props.lang].split(",")
      .map((e, index) => {
        return (
          <span key={e}>
            <span style={{ color: "darkgray" }}> {index + 1} - </span>
            {/* {globalState.state.temp.uploads.find(f => e === f.s_name).l_name} */}
            <span style={{ color: "darkgray" }}>
              {globalState.state.temp.uploads.length > 0
                ? globalState.state.temp.uploads.find((f) => e === f.s_name)
                  ? globalState.state.temp.uploads.find((f) => e === f.s_name)
                      .l_name
                  : e
                : e}
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
              {/* <BsCheckCircle size={15} className="checkedIcon" />
            <IoIosCloseCircleOutline
              className="checkedIcon"
              size={15}
              style={{ color: "red" }}
            />
            <FiPlayCircle
              className="checkedIcon"
              size={15}
              style={{ color: "purple" }}
            /> */}
              <ReactAudioPlayer
                src={`http://34.214.61.86/cm_data/audio/${e}`}
                // autoPlay
                controls
              />
            </div>
          </span>
        );
      });
    return <span> {Filelist} </span>;
  };

  useEffect(() => {
    var arr = [];
    for (var i = 1; i < numberOfMainDTMFWhenIVRIsSelected + 1; i++) {
      arr.push(i);
    }
    setArr(arr);
  }, [numberOfMainDTMFWhenIVRIsSelected]);

  // useEffect(()=>{
  //   if(props.hideItemStyle === undefined){
  //     errorDispatch({type:'AUDIO', payload: true})
  //   }
  //   setShowError(false)
  //   errorDispatch({type: "SUB_DTMF", payload: false})
  // },[])

  // useEffect(()=>{
  //   if(traverseAndModify(props.current.id,props.current,'waitTime',null,'read')){

  //     errorDispatch({type: "SUB_DTMF", payload: true})
  //   }
  //   else{
  //     errorDispatch({type: "SUB_DTMF", payload: false})
  //   }
  // },[traverseAndModify(props.current.id,props.current,'waitTime',null,'read')])

  useEffect(() => {
    setShowError(false);
    return () => {
      errorDispatch({ type: "SUB_DTMF", payload: false });
    };
  }, []);

  useEffect(() => {
    if (isFilled) {
      errorDispatch({ type: "SUB_DTMF", payload: false });
    }
  }, [isFilled]);

  useEffect(() => {
    if (
      !isFilled &&
      !traverseAndModify(
        props.current.id,
        props.current,
        "waitTime",
        null,
        "read"
      )
    ) {
      errorDispatch({ type: "SUB_DTMF", payload: true });
    }
  }, [
    isFilled,
    traverseAndModify(
      props.current.id,
      props.current,
      "waitTime",
      null,
      "read"
    ),
  ]);

  return (
    <>
      <div className="subDTMF__subdtmf">
        <div className="sudDTMF__subdtmf__container">
          <Card
            style={{
              backgroundColor: props.isBgColor ? "white" : "#f5f5f5",
              width: props.width,
            }}
          >
            <CardActions disableSpacing>
              <Typography paragraph>SUB DTMF</Typography>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{
                  // width: "75%",
                  // border:"2px solid red",
                  borderRadius: "0",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <div className="main__dtmf__maincontent__container">
                  <div className="subdtmf__select__option__container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        DTMF option
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={props.current.type}
                        label="DTMF__option"
                        disabled={props.disableEditingWhileCreatingCamp}
                        onChange={(e) => {
                          handleDtmfOptionChange(e);

                          traverseAndModify(
                            props.current.id,
                            props.current,
                            "type",
                            e.target.value,
                            "edit"
                          );
                          props.dataHandleWithObj(
                            e,
                            props.global || props.current
                          );
                        }}
                        name="type"
                      >
                        {["PLAY", "Schedule SMS"].map((number, index) => {
                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="main__subdtmf__wait__time__container">
                    <Box
                      component="form"
                      style={{ width: "100%" }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="if__IVR__selected"
                        type="number"
                        label="Wait Time for DTMF input"
                        disabled={props.disableEditingWhileCreatingCamp}
                        value={traverseAndModify(
                          props.current.id,
                          props.current,
                          "waitTime",
                          null,
                          "read"
                        )}
                        onChange={(e) => {
                          setIsFilled(() => e.target.value !== "");
                          traverseAndModify(
                            props.current.id,
                            props.current,
                            "waitTime",
                            e.target.value >= 0 ? e.target.value : 0,
                            "edit"
                          );
                        }}
                        onWheel={(e) => e.target.blur()}
                        variant="outlined"
                        required
                        error={
                          showError
                            ? parseInt(
                                traverseAndModify(
                                  props.current.id,
                                  props.current,
                                  "waitTime",
                                  null,
                                  "read"
                                )
                              ) >= 0
                              ? false
                              : true
                            : false
                        }
                      />
                    </Box>
                  </div>
                  <div className="select__number__of__subDTMF__from__subdtmf__container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label" required>
                      Number of options for this selection
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-select"
                        value={props.current.dtmf_count}
                        disabled={props.disableEditingWhileCreatingCamp}
                        // value={globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount || 0 : props.current.dtmf_count}
                        label="Number of options for this selection"
                        name="sub_audio_dtmfs_dtmfCount"
                        onChange={(e) => {
                          detectLevel(e, "sub_audio_dtmfs", props.current);
                        }}
                        required
                      >
                        {numberOfSubDTMF.map((number, index) => {
                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>

                  <div
                    className={props.hideItemStyle}
                    style={{ width: "100%" }}
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
                    <div className="ghghg" style={{ margin: "10px 0" }}>
                      {languageName.map((el) => {
                        return (
                          <Typography style={{ fontSize: "12px" }}>
                            Welcome prompt audio file for {el}
                          </Typography>
                        );
                      })}
                    </div>
                    <div className="ghghgh">
                      {localStore.ivrCampFlowData.flow.languageChange.map(
                        (lang) => (
                          <FileUploaderForSubDTMF
                            lang={lang}
                            main_audio_file={
                              localStore.ivrCampFlowData.flow.main_audio_file
                            }
                            current={props.current}
                            uploadFiles={uploadFiles}
                            traverseAndModify={traverseAndModify}
                            AudioFilesL2={AudioFilesL2}
                            hideItemStyle={props.hideItemStyle}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="rendering__sub__subdtmf__container">
                {/* {arr1.length > 0 &&
                  arr1.map((el, ind) => { */}
                {props.current.actions &&
                  props.current.actions.map((e, index) => {
                    return (
                      <div style={{}}>
                        <SubDTMF
                          width="100%"
                          isBgColor={!props.isBgColor}
                          data={props}
                          current={e}
                          handleDataChange={props.handleDataChange}
                          onChange={props.handleChange}
                          uploadFiles={props.uploadFiles}
                          setWaitTime={props.setWaitTime}
                          setDataDynamic={props.setDataDynamic}
                          parentNumber={props.dtmfNumber}
                          numberOfSubDTMF={e}
                          dataHandleWithObj={props.dataHandleWithObj}
                          hideItemStyle={props.hideItemStyle}
                          disableEditingWhileCreatingCamp={
                            props.disableEditingWhileCreatingCamp
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            </Collapse>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubDTMF;

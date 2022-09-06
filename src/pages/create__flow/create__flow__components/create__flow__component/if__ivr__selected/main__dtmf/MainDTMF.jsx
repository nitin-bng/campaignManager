import React, { useState, useEffect, useContext } from "react";

import "./maindtmf.css";

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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SubDTMF from "../sub__dtmf/SubDTMF";
import { store } from "../../../../../../store/store";
import { findAndModifyFirst } from "obj-traverse/lib/obj-traverse";

import { BsCheckCircle } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiPlayCircle, FiRefreshCcw } from "react-icons/fi";
import { FiPauseCircle } from "react-icons/fi";
import { Howl } from "howler";

import config from "../../../../../../ApiConfig/Config";
import { useError } from "../../../../../../store/errorContext";
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
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

const MainDTMF = (props) => {
  var hellohello = [];
  var languageName = [];
  const [disableInputTag, setDisableInputTag] = useState(true);
  const [expanded, setExpanded] = React.useState(true);
  const {showError,setShowError, errorDispatch, setAudioError} = useError()
  console.log("props props props", props);
  const [
    numberOfMainDTMFWhenIVRIsSelected,
    setnumberOfMainDTMFWhenIVRIsSelected,
  ] = React.useState("");

  const [selectOptionForMainDTMF, setSelectOptionForMainDTMF] =
    React.useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChange = (event) => {
    setSelectOptionForMainDTMF(event.target.value);
  };

  const handleIVRSelectedChange = (event) => {
    setnumberOfMainDTMFWhenIVRIsSelected(event.target.value);
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
        setAudioError(prev=>{
          prev.pop()
          return prev
        })
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

  const globalState = useContext(store);
  let localStore = globalState.state;
  const { disableChannel } = props;
  console.log("dtmfs options", props);
  // const { fileuploadclick } = props;

  const { dispatch } = globalState;

  const genArray = (n) => {
    return Array(n)
      .fill()
      .map((x, i) => i + 1);
  };

  const detectLevel = (e, target, current) => {
    debugger;
    handleIVRSelectedChange(e);
    console.log("dtmfs--- options", props, e, target, current);
    if (target === "main_audio") {
      props.handleDataChange(e);
    } else if (target === "sub_audio_dtmfs") {
      props.setDataDynamic("sub_audio_dtmfs", e, current);
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


  const AudioFiles = (props) => {
    debugger;
    console.log('audiofileprops', props);
    const Filelist = globalState.state.ivrCampFlowData.flow.actions[
        props.dtmf
    ].audio_file[props.lang]
        .split(',')
        .map((e, index) => {
            return (
                <span key={e}>
                    <span style={{ color: 'darkgray' }}>
                        {' '}
                        {index + 1} -{' '}
                    </span>
                    {globalState.state.temp.uploads.length > 0
                        ? globalState.state.temp.uploads.find(
                              (f) => e === f.s_name
                          )
                            ? globalState.state.temp.uploads.find(
                                  (f) => e === f.s_name
                              ).l_name
                            : e
                        : e}
                    <BsCheckCircle size={15} className="checkedIcon" />
                    <IoIosCloseCircleOutline
                        className="checkedIcon"
                        size={15}
                        style={{ color: 'red' }}
                    />
                    <FiPlayCircle
                        className="checkedIcon"
                        size={15}
                        style={{ color: 'purple' }}
                    />
                    <br></br>
                    <br></br>
                </span>
            );
        });
    return <span> {Filelist} </span>;
};

  const [arr1, setArr] = useState([]);
  useEffect(() => {
    var arr = [];
    for (var i = 1; i < numberOfMainDTMFWhenIVRIsSelected + 1; i++) {
      arr.push(i);
    }

    setArr(arr);
  }, [numberOfMainDTMFWhenIVRIsSelected]);


  useEffect(()=>{
    if(props.hideItemStyle === undefined){
      setAudioError(prev=>[...prev, true])
    }

    setShowError(false)
    errorDispatch({type: "MAIN_DTMF", payload: false})
  },[])

  useEffect(()=>{
    if(globalState.state.ivrCampFlowData.flow.actions[props.global.dtmf_key - 1].waitTime){

      errorDispatch({type: "MAIN_DTMF", payload: true})
    }
    else{
      errorDispatch({type: "MAIN_DTMF", payload: false})
    }
  },[globalState.state.ivrCampFlowData.flow.actions[props.global.dtmf_key - 1].waitTime])

  return (
    <>
      <div className="main__dtmf">
      {console.log('data is here',props.data)}
        <div className="main__dtmf__container">
          <Card
            style={{ backgroundColor: "rgba(0, 0, 0, 0.04)", padding: "1rem" }}
            fullWidth
          >
            <CardActions disableSpacing>
              <Typography paragraph>DTMF : {props.dtmfNumber} </Typography>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <div className="main__dtmf__maincontent__container">
                  <div className="dtmf__select__option__container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        DTMF option
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={globalState.state.ivrCampFlowData.flow.actions[props.data-1].type}
                        label="DTMF__option"
                        onChange={(e) => {
                          handleChange(e);
                          props.dataHandleWithObj(
                            e,
                            props.global || props.current
                          );
                        }}
                        disabled={props.disableEditingWhileCreatingCamp}
                        name="type"
                      >
                        {["PLAY"].map((number, index) => {
                          console.log(number);
                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="main__dtmf__wait__time__container">
                    <Box
                      component="form"
                      style={{ width: "100%" }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        // id="if__IVR__selected"
                        id={"waitTime_" + props.global.dtmf_key}
                        disabled={
                          // disableProperties &&
                          disableChannel == "SMS" ||
                          // !disableProperties &&
                          disableChannel == "SMS" ||
                          props.disableEditingWhileCreatingCamp
                        }
                        type="number"
                        label="Main Wait iolkljk Time"
                        name={"waitTime_" + props.global.dtmf_key}
                        value={
                          globalState.state.ivrCampFlowData.flow.actions[
                            props.global.dtmf_key - 1
                          ].waitTime
                        }
                        onChange={(e) =>
                          props.setWaitTime(
                            "sub",
                            e.target,
                            props.global.dtmf_key
                          )
                        }
                        variant="outlined"
                        required
                        error={showError ? globalState.state.ivrCampFlowData.flow.actions[
                          props.global.dtmf_key - 1
                        ].waitTime ? false:true:false}
                      />
                    </Box>
                  </div>

                  <div className="select__number__of__subDTMF__from__main__dtmf__container">
                    <FormControl style={{ width: "100%" }}>
                      {console.log("ggffggff",props)}
                      <InputLabel id="demo-simple-select-label">
                        fyg DTMF
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={props.global.dtmf_count || null}
                        label="DTMF"
                        name="sub_audio_dtmfs_dtmfCount"
                        onChange={(e) => {
                          detectLevel(e, "sub_audio_dtmfs", props.global);
                        }}
                        disabled= {props.disableEditingWhileCreatingCamp}
                      >
                        {numberOfSubDTMF.map((number, index) => {
                          console.log(number);

                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}

                        
                      </Select>
                    </FormControl>
                  </div>
                  <div className={props.hideItemStyle}>
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
                    <div className="ghghg">
                      {languageName.map((el) => {
                        return <span>enter audio file for {el}</span>;
                      })}
                    </div>
                    <div className="ghghgh">
                      {localStore.ivrCampFlowData.flow.languageChange.map(
                        (lang) => (
                          <div className="file__chooser__container">
                            <input
                              accept="audio/mp3"
                              type="file"
                              class="custom-file-input"
                              name="main_audio_file"
                              onChange={(event) => {
                                uploadFiles(
                                  props.parentNode +
                                                    '_' +
                                                    props.global.dtmf_key,
                                  event,
                                  event.currentTarget.files,
                                  lang
                                );
                              }}
                              required
                            />
                            {globalState.state
                                                    .ivrCampFlowData.flow
                                                    .actions[
                                                    props.global.dtmf_key - 1
                                                ].audio_file[lang] ? (
                                                    // (<div>{globalState.state.ivrCampFlowData.flow.actions[props.global.dtmf_key - 1].audio_file[lang]}</div>)
                                                    <div>
                                                        <AudioFiles
                                                            dtmf={
                                                                props.global
                                                                    .dtmf_key -
                                                                1
                                                            }
                                                            lang={lang}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        Please upload the audio
                                                        file
                                                    </div>
                                                )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="rendering__subdtmf__container">
                {/* {arr1.length > 0 &&
                  arr1.map((el, ind) => { */}
                {props.global.actions.map((e, index) => {
                  return (
                    <SubDTMF
                      data={props}
                      current={e}
                      isBgColor = {true}
                      handleDataChange={props.handleDataChange}
                      onChange={props.handleChange}
                      uploadFiles={props.uploadFiles}
                      setWaitTime={props.setWaitTime}
                      setDataDynamic={props.setDataDynamic}
                      parentNumber={props.dtmfNumber}
                      numberOfSubDTMF={e}
                      dataHandleWithObj={props.dataHandleWithObj}
                      hideItemStyle = {props.hideItemStyle}
                      disableEditingWhileCreatingCamp = {props.disableEditingWhileCreatingCamp}
                      // disableProperties={disableProperties}
                      // disableChannel={disableChannel}
                    />
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

export default MainDTMF;

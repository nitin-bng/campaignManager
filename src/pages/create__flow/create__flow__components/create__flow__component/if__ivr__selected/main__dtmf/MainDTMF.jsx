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
import { Howl } from "howler";
import ReactAudioPlayer from "react-audio-player";

import config from "../../../../../../ApiConfig/Config";
import { useError } from "../../../../../../store/errorContext";
import { FileUploaderForMainDTMF } from "../../../../../../components/fileUpload/FileUploaderForMainDTMF";
import { CommonContext } from "../../../../../../helpers/CommonContext";
import { MessageUploadForMainDTMF } from "../../../../../../components/messageUpload/MessageUploadForMainDTMF";
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

const MainDTMF = (props) => {
  var hellohello = [];
  var languageName = [];
  const [expanded, setExpanded] = useState(true);
  const { showError, setShowError, errorDispatch } = useError();
  const [isFilled, setIsFilled] = useState(false);
  const { channel } = useContext(CommonContext);
  const [showLoader, setShowLoader] = useState(false);

  console.log("props props props", props);
  const [
    numberOfMainDTMFWhenIVRIsSelected,
    setnumberOfMainDTMFWhenIVRIsSelected,
  ] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
        errorDispatch({ type: "AUDIO", payload: false });
        return response;
      })
      .catch((e) => {
        console.log("error in file upload", e);
      });
  }

  function AudioClips() {
    debugger;
    let isPlaying = false;
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
  }

  const globalState = useContext(store);
  let localStore = globalState.state;
  const { disableChannel } = props;

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
            node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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
      localStore.ivrCampFlowData.flow.actions[current.id - 1].dtmf_count =
        newNumOfCards;
      dispatch({ type: "SET_DATA", nState: localStore });
    }
  };

  const AudioFiles = (props) => {
    debugger;
    console.log("audiofileprops", props);
    const Filelist = globalState.state.ivrCampFlowData.flow.actions[
      props.dtmf
    ].audio_file[props.lang]
      .split(",")
      .map((e, index) => {
        return (
          <span key={e}>
            <span style={{ color: "darkgray" }}> {index + 1} - </span>
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
              <ReactAudioPlayer
                src={config.server.path + `/cm_data/audio/${e}`}
                controls
              />
            </div>
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

  console.log("here", localStore);

  useEffect(() => {
    setShowError(false);
    if (channel === "USSD") {
      globalState.state.ivrCampFlowData.flow.actions[props.data - 1].type =
        "HITURL_USSD";
      globalState.state.ivrCampFlowData.flow.actions[
        props.data - 1
      ].actionType.ussd = "HITURL_USSD";
      dispatch({ type: "SET_DATA", nState: globalState.state });
    } else if (channel === "SMS") {
      globalState.state.ivrCampFlowData.flow.actions[props.data - 1].type =
        "HITURL_SMS";
      globalState.state.ivrCampFlowData.flow.actions[
        props.data - 1
      ].actionType.sms = "HITURL_SMS";
      dispatch({ type: "SET_DATA", nState: globalState.state });
    }
    return () => {
      errorDispatch({ type: "MAIN_DTMF", payload: false });
    };
  }, []);

  useEffect(() => {
    if (isFilled) {
      errorDispatch({ type: "MAIN_DTMF", payload: false });
    }
  }, [isFilled]);

  useEffect(() => {
    if (
      (!isFilled &&
        !globalState.state.ivrCampFlowData.flow.actions[
          props.global.dtmf_key - 1
        ].waitTime &&
        localStore.ivrCampFlowData.flow.channel === "IVR") ||
      (!isFilled &&
        !globalState.state.ivrCampFlowData.flow.actions[
          props.global.dtmf_key - 1
        ].input["ussd_key"] &&
        localStore.ivrCampFlowData.flow.channel === "USSD")
    ) {
      errorDispatch({ type: "MAIN_DTMF", payload: true });
    }
  }, [
    isFilled,
    globalState.state.ivrCampFlowData.flow.actions[props.global.dtmf_key - 1]
      .waitTime,
  ]);

  const removeExtraSubDTMFs = () => {
    localStore.ivrCampFlowData.flow.actions =
      globalState.state.ivrCampFlowData.flow.actions.map((item) => {
        let newItem = item;
        newItem.actions = newItem.actions.map((item) => {
          return { ...item, actions: [] };
        });
        return newItem;
      });
    dispatch({ type: "SET_DATA", nState: localStore });
  };

  const handleUSSD = (msg, languageCode) => {
    localStore.ivrCampFlowData.flow.actions =
      localStore.ivrCampFlowData.flow.actions.map((item) => {
        if (item.dtmf_key === props.global.dtmf_key) {
          item.audio_file[languageCode] = msg;
          item.file.sms[languageCode] = msg;
          item.file["ussd"] = item.file["ussd"] ? item.file["ussd"] : {};
          item.file.ussd[languageCode] = msg;
          item.file["sms"] = item.file["sms"] ? item.file["sms"] : {};
          item.file.sms[languageCode] = msg;
        }
        return item;
      });
    dispatch({ type: "SET_DATA", nState: localStore });
  };

  return (
    <>
      {localStore.ivrCampFlowData.flow.channel === "IVR" ? (
        <div className="main__dtmf">
          <div className="main__dtmf__container">
            <Card
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                padding: "1rem",
                position:"relative"
              }}
              fullWidth
            >
              <CardActions disableSpacing>
                <Typography paragraph>Option : {props.dtmfNumber} </Typography>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                  style={{ display: "flex", justifyContent: "flex-end", zIndex:"1000" }}
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position:"absolute",
                    top:"10px",
                    zIndex:"1"
                  }}
                >
                  <Typography style={{ fontSize: ".6rem", fontWeight: "800" }}>
                    DTMF To Choose this option :{" "}
                  </Typography>
                  <button
                    style={{
                      height: "25px",
                      width: "25px",
                      backgroundColor: "rgb(214,214,214)",
                      padding: "0",
                      borderTop: "none",
                      borderLeft: "none",
                      boxShadow: "3px 3px 5px #474343, -3px -3px 5px #fff",
                      color: "black",
                      marginTop: ".5rem",
                    }}
                    disabled
                  >
                    {props.dtmfNumber}
                  </button>
                </div>
                <CardContent>
                  <div className="main__dtmf__maincontent__container">
                    <div className="dtmf__select__option__container">
                      <FormControl style={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-label">
                          Actions
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={
                            globalState.state.ivrCampFlowData.flow.actions[
                              props.data - 1
                            ].type  === 'PLAY_BARGEIN' ? 'PLAY': globalState.state.ivrCampFlowData.flow.actions[
                              props.data - 1
                            ].type
                          }
                          label="Actions"
                          onChange={(e) => {
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
                    {/* <div className="main__dtmf__wait__time__container">
                      <Box
                        component="form"
                        style={{ width: "100%" }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id={"waitTime_" + props.global.dtmf_key}
                          disabled={
                            disableChannel == "SMS" ||
                            disableChannel == "SMS" ||
                            props.disableEditingWhileCreatingCamp
                          }
                          type="number"
                          label="Wait Time for DTMF input"
                          name={"waitTime_" + props.global.dtmf_key}
                          value={
                            globalState.state.ivrCampFlowData.flow.actions[
                              props.global.dtmf_key - 1
                            ].waitTime
                          }
                          onChange={(e) => {
                            setIsFilled(() => e.target.value !== "");
                            props.setWaitTime(
                              "sub",
                              e.target,
                              props.global.dtmf_key
                            );
                          }}
                          onWheel={(e) => e.target.blur()}
                          variant="outlined"
                          required
                          error={
                            showError
                              ? parseInt(
                                  globalState.state.ivrCampFlowData.flow
                                    .actions[props.global.dtmf_key - 1].waitTime
                                ) >= 0
                                ? false
                                : true
                              : false
                          }
                        />
                      </Box>
                    </div> */}

                    <div className="select__number__of__subDTMF__from__main__dtmf__container">
                      <FormControl style={{ width: "100%" }}>
                        {console.log("ggffggff", props)}
                        <InputLabel
                          id="demo-simple-select-label"
                          required
                          error={
                            showError
                              ? parseInt(props.global.dtmf_count, 10) >= 0
                                ? false
                                : true
                              : false
                          }
                        >
                          Number of options after this node
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={props.global.dtmf_count}
                          label="Number of options after this node"
                          name="sub_audio_dtmfs_dtmfCount"
                          onChange={(e) => {
                            detectLevel(e, "sub_audio_dtmfs", props.global);
                          }}
                          disabled={props.disableEditingWhileCreatingCamp}
                          required
                          error={
                            showError
                              ? parseInt(props.global.dtmf_count, 10) >= 0
                                ? false
                                : true
                              : false
                          }
                        >
                          {numberOfSubDTMF.map((number, index) => {
                            console.log(number);

                            return <MenuItem value={number}>{number}</MenuItem>;
                          })}
                        </Select>
                      </FormControl>
                    </div>

                    <div
                      className={props.hideItemStyle}
                      style={{ boxShadow: "2px 2px 3px grey", width: "100%" }}
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
                      <div
                        className="ghghg"
                        style={{
                          margin: "10px 0",
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {languageName.map((el) => {
                          return (
                            <Typography style={{ fontSize: "12px" }}>
                              Welcome prompt audio file for {el}
                            </Typography>
                          );
                        })}
                      </div>
                      <div
                        className="ghghgh"
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          width: "100%",
                        }}
                      >
                        {localStore.ivrCampFlowData.flow.languageChange.map(
                          (lang) => (
                            <FileUploaderForMainDTMF
                              lang={lang}
                              hideItemStyle={props.hideItemStyle}
                              parentNode={props.parentNode}
                              global={props.global}
                              globalState={globalState}
                              uploadFiles={uploadFiles}
                              AudioFiles={AudioFiles}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="rendering__subdtmf__container">
                  {props.global.actions.map((e, index) => {
                    console.log("kya hai", e);
                    return (
                      <SubDTMF
                        data={props}
                        current={e}
                        isBgColor={true}
                        handleDataChange={props.handleDataChange}
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
                    );
                  })}
                </div>
              </Collapse>
            </Card>
          </div>
        </div>
      ) : (
        <div className="main__dtmf">
          <div className="main__dtmf__container">
            <Card
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                padding: "1rem",
              }}
              fullWidth
            >
              <CardActions disableSpacing>
                <Typography paragraph>OPTION : {props.dtmfNumber} </Typography>
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
                          Actions
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={
                            globalState.state.ivrCampFlowData.flow.actions[
                              props.data - 1
                            ].type
                          }
                          label="Actions"
                          onChange={(e) => {
                            props.dataHandleWithObj(
                              e,
                              props.global || props.current
                            );
                          }}
                          disabled={props.disableEditingWhileCreatingCamp}
                          name="type"
                        >
                          {channel === "USSD"
                            ? ["HITURL_USSD"].map((number, index) => {
                                return (
                                  <MenuItem value={number}>{number}</MenuItem>
                                );
                              })
                            : channel === "SMS" &&
                              ["HITURL_SMS"].map((number, index) => {
                                return (
                                  <MenuItem value={number}>{number}</MenuItem>
                                );
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
                          id={"waitTime_" + props.global.dtmf_key}
                          disabled={
                            disableChannel == "SMS" ||
                            disableChannel == "SMS" ||
                            props.disableEditingWhileCreatingCamp
                          }
                          type="input"
                          label="Input key to choose this option"
                          name={"waitTime_" + props.global.dtmf_key}
                          value={
                            globalState.state.ivrCampFlowData.flow.actions[
                              props.global.dtmf_key - 1
                            ].input[
                              channel === "USSD"
                                ? "ussd_key"
                                : channel === "SMS" && "sms_key"
                            ]
                          }
                          onChange={(e) => {
                            setIsFilled(() => e.target.value !== "");
                            props.setInputKey(
                              "sub",
                              e.target,
                              props.global.dtmf_key,
                              channel === "SMS" ? true : false
                            );
                          }}
                          onWheel={(e) => e.target.blur()}
                          variant="outlined"
                          required
                          error={
                            showError
                              ? globalState.state.ivrCampFlowData.flow.actions[
                                  props.global.dtmf_key - 1
                                ].input[
                                  channel === "USSD"
                                    ? "ussd_key"
                                    : channel === "SMS" && "sms_key"
                                ]
                                ? false
                                : true
                              : false
                          }
                        />
                      </Box>
                    </div>

                    <div className="select__number__of__subDTMF__from__main__dtmf__container">
                      <FormControl style={{ width: "100%" }}>
                        {console.log("ggffggff", props)}
                        <InputLabel
                          id="demo-simple-select-label"
                          required
                          error={
                            showError
                              ? parseInt(props.global.dtmf_count, 10) >= 0
                                ? false
                                : true
                              : false
                          }
                        >
                          Number of options after this node
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={props.global.dtmf_count}
                          label="Number of options after this node"
                          name="sub_audio_dtmfs_dtmfCount"
                          onChange={(e) => {
                            detectLevel(e, "sub_audio_dtmfs", props.global);
                            removeExtraSubDTMFs();
                          }}
                          disabled={props.disableEditingWhileCreatingCamp}
                          required
                          error={
                            showError
                              ? parseInt(props.global.dtmf_count, 10) >= 0
                                ? false
                                : true
                              : false
                          }
                        >
                          {numberOfSubDTMF.map((number, index) => {
                            console.log(number);

                            return <MenuItem value={number}>{number}</MenuItem>;
                          })}
                        </Select>
                      </FormControl>
                    </div>

                    <div
                      className={props.hideItemStyle}
                      style={{
                        width: "100%",
                        // border: "2px solid blue",
                        // display: "flex",
                        // flexDirection: "column",
                        // alignItems: "center",
                      }}
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
                      <div
                        className="ghghg"
                        style={{
                          margin: "10px 0",
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {languageName.map((el) => {
                          return (
                            <Typography style={{ fontSize: "12px" }}>
                              Message in {el}
                            </Typography>
                          );
                        })}
                      </div>
                      <div
                        className="ghghgh"
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          width: "100%",
                        }}
                      >
                        {localStore.ivrCampFlowData.flow.languageChange.map(
                          (lang) => (
                            <MessageUploadForMainDTMF
                              lang={lang}
                              handleUSSD={handleUSSD}
                              localStore={localStore}
                              global={props.global}
                              hideItemStyle={props.hideItemStyle}
                              channel={channel}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="rendering__subdtmf__container">
                  {props.global.actions.map((e, index) => {
                    console.log("kya hai", e);
                    return (
                      <SubDTMF
                        data={props}
                        current={e}
                        isBgColor={true}
                        handleDataChange={props.handleDataChange}
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
                    );
                  })}
                </div>
              </Collapse>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default MainDTMF;

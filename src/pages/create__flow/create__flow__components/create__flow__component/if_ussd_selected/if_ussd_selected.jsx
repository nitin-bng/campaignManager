import { useContext, useEffect, useState } from "react";
import { useError } from "../../../../../store/errorContext";
import { store } from "../../../../../store/store";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CommonContext } from "../../../../../helpers/CommonContext";
import MainDTMF from "../if__ivr__selected/main__dtmf/MainDTMF";
import Typography from "@mui/material/Typography";
import { LanguageComponent } from "../../../../../components/languageComponent";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { MessageUploadForIfUSSDSelected } from "../../../../../components/messageUpload/MessageUploadForIfUSSDSelected";

const numberOfDTMF = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

const languageNames = {
  _E: "English",
  _H: "Hindi",
  _A: "Arabic",
  _S: "Spanish",
};

const IfUssdSelected = ({
  hideItemStyle,
  disableEditingWhileCreatingCamp,
  languageComponentProps,
}) => {
  const globalState = useContext(store);
  const { dispatch } = globalState;
  const localStore = globalState.state;
  const { showError, setShowError, errorDispatch } = useError();
  const { setnumberOfMainDTMFWhenIVRIsSelected } = useContext(CommonContext);
  const [data, setData] = useState({
    dtmf: 0,
    playOption: "PLAY",
  });
  const channel = globalState.state.ivrCampFlowData.flow.channel;
  const [disableChannel, setDisableChannel] = useState(channel);
  const [isThankYouMsg, setIsThankYouMsg] = useState(false);

  const handleDataChange = (e) => {
    debugger;

    const key = e.target.name;
    if (key === "main_audio_dtmfCount") {
      localStore.ivrCampFlowData.flow[key] = e.target.value;
      dispatch({ type: "SET_DTMF_MAIN", nState: localStore });
    }
  };

  const detectLevel = (e, target, current) => {
    handleChange(e);
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
                node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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
                node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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

  const handleChange = (event) => {
    setnumberOfMainDTMFWhenIVRIsSelected(event.target.value);
    return;
  };

  const setDataDynamic = (type, e, current) => {
    debugger;

    let localStore = globalState.state;

    if (type === "sub_audio_dtmfs") {
      if (current.level === 1) {
        console.log("===================================================");

        const oldNumOfCards =
          localStore.ivrCampFlowData.flow.actions[current.dtmf_key - 1]
            .dtmf_count;
        const newNumOfCards = e.target.value;
        console.log('nitin value setDataDynamic', newNumOfCards === 0 ? "LEAF" : "PROCESSING")
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
                        node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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
                        node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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
              node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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
          for (var i = 0; i < oldNumOfCards - newNumOfCards; i++)
            localStore.ivrCampFlowData.flow.actions[
              current.dtmf_key - 1
            ].actions.pop();
        }
      }
      if (current.level === 2) {
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
                  node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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
                  node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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
              node_type: newNumOfCards === 0 ? "LEAF" : "PROCESSING",
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

  useEffect(() => {
      setShowError(false);
      errorDispatch({ type: "IF_USSD_SELECTED", payload: false });
    return () => errorDispatch({ type: "IF_USSD_SELECTED", payload: true });
  }, []);

  useEffect(() => {
      if ((localStore.ivrCampFlowData.flow.main_file.ussd._E && localStore.ivrCampFlowData.flow.channel === 'IVR')||(globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount >=0 && localStore.ivrCampFlowData.flow.channel === 'USSD')) {
        errorDispatch({ type: "IF_USSD_SELECTED", payload: true });
      } else {
        errorDispatch({ type: "IF_USSD_SELECTED", payload: false });
      }
  }, [localStore.ivrCampFlowData.flow.main_file.ussd._E, globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount]);

  const setInputKey = (level, target, dtmf_key, sms=false) => {
    let localStore = globalState.state;
    if (level === "main")
      localStore.ivrCampFlowData.flow.waitTime = target.value;
    else if (level === "sub")
      localStore.ivrCampFlowData.flow.actions[dtmf_key - 1].input[sms ? "sms_key" : "ussd_key"] =
        target.value;
    console.log("localStore.ivrCampFlowData = ", localStore.ivrCampFlowData);
    dispatch({ type: "SET_DATA", nState: localStore });
  };

  const dataHandleWithObj = (e, obj) => {
    debugger;
    console.log("change dtmf type", e, obj);
    const key = e.target.name;
    let localStore = globalState.state;

    if (key === "type") {
      if (obj.parent_dtmf) {
        obj.type = e.target.value;

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

  var hellohello = [];
  var languageName = [];

  const Root = styled("div")(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    "& > :not(style) + :not(style)": {
      marginTop: theme.spacing(2),
    },
  }));

  const handleThankYou = (e) => {
    setIsThankYouMsg(e.target.checked);
    if (e.target.checked) {
      dispatch({ type: "SET_THANKYOU", nState: true });
    } else {
      dispatch({ type: "SET_THANKYOU", nState: false });
    }
  };

  console.log('nitin thank you', localStore.ivrCampFlowData.flow.actions)
  const handleThankYouMsg = (msg, languageCode) => {
    localStore.ivrCampFlowData.flow.actions =
      localStore.ivrCampFlowData.flow.actions.map((item) => {
        if (item.node_type === "END") {
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
      <div className={hideItemStyle}></div>
      <Divider style={{ marginTop: "1rem" }}>
        Welcome  
        {localStore.ivrCampFlowData.flow.language[0].actions.length > 1
          ? "& Language Selection "
          : "" +
        " Node"}
      </Divider>
      <div
        className="main__wait__time__and__dtmf__container"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ width: "96%" }} className={hideItemStyle}>
          {localStore.ivrCampFlowData.flow.language.map((hello) => {
            console.log("localStore.ivrCampFlowData.flow.language ===>", hello);
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
          <div className="ghghgh" style={{}}>
            {localStore.ivrCampFlowData.flow.languageChange.map((lang) => (
              <>
                  <MessageUploadForIfUSSDSelected lang={lang} hideItemStyle={hideItemStyle} languageNames={languageNames} />
              </>
            ))}
          </div>
        </div>
      </div>

      {/* <div className={hideItemStyle} style={{ marginTop: "1rem" }}>
        <Divider className={hideItemStyle} style={{ marginTop: "1rem" }}>
          Sticker here
        </Divider>
      </div> */}
      <LanguageComponent props={languageComponentProps} />

      <div className="main__dtms__container" style={{ width: "100%" }}>
        <FormControl style={{ width: "40%", marginTop: "1rem" }}>
          <InputLabel
            id="demo-simple-select-label"
            required
            error={
              showError
                ? parseInt(
                    globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount,
                    10
                  ) >= 0
                  ? false
                  : true
                : false
            }
          >
            Number of options after Welcome{" "}
            {localStore.ivrCampFlowData.flow.language[0].actions.length > 1
              ? "& Language Selection "
              : ""}{" "}
            Node
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount}
            label={`Number of options after Welcome ${
              localStore.ivrCampFlowData.flow.language[0].actions.length > 1
                ? "& Language Selection "
                : ""
            } Node`}
            onChange={(e) => {
              detectLevel(e, "main_audio");
              console.log(e.target);
            }}
            name="main_audio_dtmfCount"
            disabled={disableEditingWhileCreatingCamp}
            required
            error={
              showError
                ? parseInt(
                    globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount,
                    10
                  ) >= 0
                  ? false
                  : true
                : false
            }
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
              setInputKey={setInputKey}
              hideItemStyle={hideItemStyle}
              disableEditingWhileCreatingCamp={disableEditingWhileCreatingCamp}
            />
          );
        })}
      </div>
      <div
        style={{ width: "30%", display: "flex", margin:"auto" }}
        className={hideItemStyle}
      >
        <div style={{ width: "20%" }} className={hideItemStyle} >
          <input
            style={{}}
            type="checkbox"
            id="thank-you-msg"
            value={isThankYouMsg}
            onChange={(e) => handleThankYou(e)}
          />
        </div>
        <label
          style={{ width: "80%"}}
          htmlFor="thank-you-msg"
          className={hideItemStyle}
        >
          Add Thank you message
        </label>
      </div>
      {isThankYouMsg &&
        localStore.ivrCampFlowData.flow.languageChange.map((lang) => (
          <div style={{width:"40%", display:"inline-block", margin:"0 5%"}} className={hideItemStyle}>
            <TextField
              hideItemStyle={hideItemStyle}
              localStore={localStore}
              lang={lang}
              id="outlined-multiline-static"
              label={`Thank you message in ${languageNames[lang]}`}
              multiline
              rows={2}
              variant="outlined"
              onChange={(e) => handleThankYouMsg(e.target.value, lang)}
              error={
                showError
                  ? localStore.ivrCampFlowData.flow.main_file.ussd._E
                    ? false
                    : true
                  : false
              }
              style={{ width: "10%", marginTop: "1rem" }}
            />
          </div>
        ))}
    </>
  );
};

export { IfUssdSelected };

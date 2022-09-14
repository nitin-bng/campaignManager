import React, { useState, useContext, useEffect } from "react";

import { Languages } from "../../../../helpers/All__mapping";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import IfIVRSelected from "./if__ivr__selected/IfIVRSelected";
import IfSMSSelected from "./if__sms__selected/IfSMSSelected";
import RenderingComponentOnLanguageSelect from "./if__ivr__selected/rendering__component__on__language__select/RenderingComponentOnLanguageSelect";
import RenderingComponentOnLanguageSelectOfSMS from "./if__sms__selected/rendering__component__on__language__select__sms/RenderingComponentOnLanguageSelectOfSMS";
// import MainDTMF from "./if__ivr__selected/main__dtmf/MainDTMF";
import { CommonContext } from "../../../../helpers/CommonContext";
import { store } from "../../../../store/store";
import classNames from "classnames";

import "./createFlowComponent.css";
import { useError } from "../../../../store/errorContext";
import { IfUssdSelected } from "./if_ussd_selected/if_ussd_selected";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateFlowComponent = (props) => {
  const [data, setData] = useState({
    dtmf: 0,
    playOption: "PLAY",
  });
  const { showError, setShowError, errorDispatch, errorState } = useError();

  // const [hideItem, setHideItem] = useState(true);
  // const hideItemStyle = classNames("file__chooser__container", {
  //   "hideInput": hideItem,
  //   "showInput": !hideItem,
  // });

  const languagesCode = [];
  const {
    dtmfTimeHindi,
    setDtmfTimeHindi,
    dtmfTimeEnglish,
    setDtmfTimeEnglish,
    dtmfTimeArabic,
    setDtmfTimeArabic,
    dtmfTimeSpanish,
    setDtmfTimeSpanish,
    ifIVRselectedThenLanguage,
    setIfIVRselectedThenLanguage,
    // dtmfTime,
    // setdtmfTime,

    flowName,
    setFlowName,
    channel,
    setChannel,
  } = useContext(CommonContext);
  debugger;
  const globalState = useContext(store);
  const { dispatch } = globalState;
  const [selectChannel, setSelectChannel] = useState("");
  // const [languages, setLanguages] = useState([]);
  let localStore = globalState.state;
  const languages = globalState.state.languages;

  const handleChange = (event) => {
    debugger;
    setChannel(event.target.value);
    localStore.ivrCampFlowData.flow.channel = event.target.value;
    localStorage.setItem("channelName", event.target.value);
    dispatch({ type: "SET_DATA", nState: localStore });
    console.log(localStore);
  };

  useEffect(() => {
    if (props.reset === false) {
      dispatch({ type: "EMPTY_DATA" });
      setIfIVRselectedThenLanguage([]);
    }
    if (props.hideItemStyle !== undefined) {
      errorDispatch({ type: "INITIALIZE" });
    }
    errorDispatch({ type: "CREATE_FLOW_COMPONENT", payload: false });
  }, []);

  useEffect(() => {
    if (
      ifIVRselectedThenLanguage.length &&
      localStore.ivrCampFlowData.flow.flowName && localStore.ivrCampFlowData.flow.channel === 'IVR'
    ) {
      errorDispatch({ type: "CREATE_FLOW_COMPONENT", payload: true });
    } 
    else if(localStore.ivrCampFlowData.flow.channel === 'USSD' && localStore.ivrCampFlowData.flow.flowName){
      errorDispatch({ type: "CREATE_FLOW_COMPONENT", payload: true });

    }
    else {
      errorDispatch({ type: "CREATE_FLOW_COMPONENT", payload: false });
    }
  }, [
    localStore.ivrCampFlowData.flow.channel,
    ifIVRselectedThenLanguage,
    localStore.ivrCampFlowData.flow.flowName,
  ]);

  const handelFlowNameChange = (event) => {
    debugger;
    localStore.ivrCampFlowData.flow.flowName = event.target.value;
    setFlowName(event.target.value);
    dispatch({ type: "SET_DATA", nState: localStore });
    localStorage.setItem("flowName", event.target.value);
    console.log(localStore);
  };

  const handleLanguageChange = (e) => {
    debugger;
    const {
      target: { value },
    } = e;

    setIfIVRselectedThenLanguage(
      typeof value === "string" ? value.split(",") : value
    );
    console.log("globalState", globalState);
    console.log("dispatch", dispatch);
    let languageChangeList = [];
    let finalLanguageList = [
      {
        level: 0,
        node_type: "LANG_SELECTION",
        id: "0",
        actions: "",
      },
    ];
    // console.log("e.target.value", e.target.value);

    for (var x = 0; x < e.target.value.length; x++) {
      for (var y in languages) {
        if (e.target.value[x] == languages[y].lang) {
          languagesCode.push(languages[y].code);
          languageChangeList.push({
            id: "0_5",
            input: {
              ivr_key: x + 1,
              sms_key: "",
            },
            language: languages[y].code,
            languageName: languages[y].lang,
            lang_file: {
              ivr: "",
              sms: "",
            },
            actionType: {
              ivr: "PLAY",
              sms: "HITURL_SMS",
            },
            action_delay_min: 0,
            repeatCount: 0,
            waitTime: "",
          });
        }
      }
    }
    console.log("languages[y]====>", languages[y].code);
    console.log("languagesCode languagesCode=======>", languagesCode);
    finalLanguageList[0].actions = languageChangeList;
    localStore.ivrCampFlowData.flow["languageChange"] = languagesCode;
    for (
      let i = 0;
      i < localStore.ivrCampFlowData.flow.languageChange.length;
      i++
    ) {
      localStore.ivrCampFlowData.flow.main_file["ivr"][
        localStore.ivrCampFlowData.flow.languageChange[i]
      ] = "";

      localStore.ivrCampFlowData.flow.main_file["sms"][
        localStore.ivrCampFlowData.flow.languageChange[i]
      ] = "";
    }

    // localStore.ivrCampFlowData.flow.channel_local = e.target.value
    console.log("finalLanguageList finalLanguageList", finalLanguageList);
    localStore.ivrCampFlowData.flow.language = finalLanguageList;
    dispatch({ type: "SET_DATA", nState: localStore });
    console.log(localStore);
  };

  return (
    <>
      <div className="create__flow__component">
        <div className="create__flow__component__container">
          <div className="basic__flow__details__container">
            <div className="basic__flow__details__heading__container">
              <h1>Basic Flow Details</h1>
            </div>
            <div className="basic__flow__details">
              <div className="create__flow__component__flow__name__container">
                <Box
                  component="form"
                  style={{ width: "100%" }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="create__flow__component__flow__name"
                    value={
                      localStore.ivrCampFlowData.flow.flowName
                        ? localStore.ivrCampFlowData.flow.flowName
                        : ""
                    }
                    label="flow name"
                    variant="outlined"
                    onChange={handelFlowNameChange}
                    disabled={props.disableEditingWhileCreatingCamp}
                    required
                    error={
                      showError
                        ? localStore.ivrCampFlowData.flow.flowName
                          ? false
                          : true
                        : false
                    }
                  />
                </Box>
              </div>
              <div className="create__flow__component__select__channel__dropdown__container">
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    required
                    error={
                      showError
                        ? localStore.ivrCampFlowData.flow.channel.length
                          ? false
                          : true
                        : false
                    }
                  >
                    Select channel
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={localStore.ivrCampFlowData.flow.channel}
                    label="Select Channel"
                    onChange={handleChange}
                    disabled={props.disableEditingWhileCreatingCamp}
                    required
                    error={
                      showError
                        ? localStore.ivrCampFlowData.flow.channel.length
                          ? false
                          : true
                        : false
                    }
                  >
                    {/* {console.log(channel)} */}

                    <MenuItem value={"IVR"}>IVR</MenuItem>
                    {/* <MenuItem value={"SMS"}>SMS</MenuItem>
                    <MenuItem value={"IVR_SMS"}>IVR/SMS</MenuItem> */}
                    <MenuItem value={"USSD"}>USSD</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="call__flow__details__container">

            <div className="call__flow__details">
              {channel === "IVR" ? (<>
                  <div className="call__flow__details__heading__container">
                    <h1>Call Flow Details</h1>
                  </div>
                <div className="call__flow__details__languages__dropdown__container">
                  <FormControl style={{ width: "50%" }}>
                    <InputLabel
                      style={{
                        backgroundColor: "white",
                        paddingRight: "4px",
                      }}
                      id="demo-multiple-checkbox-label"
                      required
                      error={
                        showError
                          ? ifIVRselectedThenLanguage.length
                            ? false
                            : true
                          : false
                      }
                    >
                      Select Languages
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={
                        localStore.ivrCampFlowData.flow.language[0].actions
                          ? localStore.ivrCampFlowData.flow.language[0].actions.map(
                              (item) => item.languageName
                            )
                          : ifIVRselectedThenLanguage
                      }
                      onChange={handleLanguageChange}
                      input={<OutlinedInput label="Select language" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                      disabled={props.disableEditingWhileCreatingCamp}
                      required
                      error={
                        showError
                          ? ifIVRselectedThenLanguage.length
                            ? false
                            : true
                          : false
                      }
                    >
                      {Languages.map((Languages) => (
                        <MenuItem key={Languages} value={Languages}>
                          <Checkbox
                            checked={
                              ifIVRselectedThenLanguage.indexOf(Languages) > -1
                            }
                          />
                          <ListItemText primary={Languages} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                </>
              ) : (
                <></>
              )}

              {
                ifIVRselectedThenLanguage.length > 1 ? <div className="hello">
                {ifIVRselectedThenLanguage.indexOf("Hindi") !== -1 &&
                channel === "IVR" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={1}
                    lang="Hindi"
                    dtmfTime={dtmfTimeHindi}
                    setDtmfTime={setDtmfTimeHindi}
                    languageCode="_H"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("English") !== -1 &&
                channel === "IVR" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={2}
                    lang="English"
                    dtmfTime={dtmfTimeEnglish}
                    setDtmfTime={setDtmfTimeEnglish}
                    languageCode="_E"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Arabic") !== -1 &&
                channel === "IVR" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={3}
                    lang="Arabic"
                    dtmfTime={dtmfTimeArabic}
                    setDtmfTime={setDtmfTimeArabic}
                    languageCode="_A"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Spanish") !== -1 &&
                channel === "IVR" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={4}
                    lang="Spanish"
                    dtmfTime={dtmfTimeSpanish}
                    setDtmfTime={setDtmfTimeSpanish}
                    languageCode="_S"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}

                {/* .................. sms .................. */}
                {ifIVRselectedThenLanguage.indexOf("Hindi") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Hindi" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("English") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="English" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Arabic") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Arabic" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Spanish") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Spanish" />
                ) : (
                  ""
                )}
              </div> : <></>
              }
              

              {channel === "IVR" ? (
                <IfIVRSelected
                  disableEditingWhileCreatingCamp={
                    props.disableEditingWhileCreatingCamp
                  }
                  hideItemStyle={props.hideItemStyle}
                />
              ) : (
                ""
              )}
              {channel === "SMS" ? (
                <IfSMSSelected hideItemStyle={props.hideItemStyle} />
              ) : (
                ""
              )}
              {channel === "USSD" ? (
                <IfUssdSelected hideItemStyle={props.hideItemStyle} />
              ): <></>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFlowComponent;

import React, { useContext, useEffect } from "react";
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
import { CommonContext } from "../../../../helpers/CommonContext";
import { store } from "../../../../store/store";
import "./createFlowComponent.css";
import { useError } from "../../../../store/errorContext";
import { IfUssdSelected } from "./if_ussd_selected/if_ussd_selected";
import { LanguageComponent } from "../../../../components/languageComponent";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const languageNames = {
  _E: "English",
  _H: "Hindi",
  _A: "Arabic",
  _S: "Spanish",
};

const CreateFlowComponent = (props) => {
  const { showError, errorDispatch } = useError();

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
    setFlowName,
    channel,
    setChannel,
  } = useContext(CommonContext);
  const globalState = useContext(store);
  const { dispatch, userFeatures } = globalState;
  let localStore = globalState.state;
  const languages = globalState.state.languages;
  const { bargein, setBargein, isThankYouNode, setIsThankYouNode } = props;
  const handleChange = (event) => {
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

    return () =>
      errorDispatch({ type: "CREATE_FLOW_COMPONENT", payload: true });
  }, []);

  useEffect(() => {
    if (
      ifIVRselectedThenLanguage.length &&
      localStore.ivrCampFlowData.flow.flowName &&
      ((localStore.ivrCampFlowData.flow.channel === "IVR" &&
        globalState.state.ivrCampFlowData.flow.repeatCount &&
        globalState.state.ivrCampFlowData.flow.waitTime) ||
        localStore.ivrCampFlowData.flow.channel === "USSD" ||
        localStore.ivrCampFlowData.flow.channel === "SMS")
    ) {
      errorDispatch({ type: "CREATE_FLOW_COMPONENT", payload: true });
    } else {
      errorDispatch({ type: "CREATE_FLOW_COMPONENT", payload: false });
    }
  }, [
    localStore.ivrCampFlowData.flow.channel,
    ifIVRselectedThenLanguage,
    localStore.ivrCampFlowData.flow.flowName,
    globalState.state.ivrCampFlowData.flow.waitTime,
    globalState.state.ivrCampFlowData.flow.repeatCount,
  ]);

  const handelFlowNameChange = (event) => {
    debugger;
    localStore.ivrCampFlowData.flow.flowName = event.target.value;
    setFlowName(event.target.value);
    dispatch({ type: "SET_DATA", nState: localStore });
    localStorage.setItem("flowName", event.target.value);
    console.log(localStore);
  };

  const handleThankYou = (e) => {
    setIsThankYouNode(e.target.checked);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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
    for (var x = 0; x < e.target.value.length; x++) {
      for (var y in languages) {
        if (e.target.value[x] == languages[y].lang) {
          languagesCode.push(languages[y].code);
          languageChangeList.push({
            id: "0_5",
            input: {
              ivr_key: x + 1,
              sms_key: "",
              ussd_key: "",
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
              ussd: "HITURL_USSD",
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

    console.log("finalLanguageList finalLanguageList", finalLanguageList);
    localStore.ivrCampFlowData.flow.language = finalLanguageList;
    localStore.ivrCampFlowData.flow.defaultLanguage =
      finalLanguageList[0].actions[0].language;

    dispatch({ type: "SET_DATA", nState: localStore });
    console.log(localStore);
  };

  const setWaitTime = (level, target, dtmf_key) => {
    const val = target.value >= 0 ? target.value : 0;
    let localStore = globalState.state;
    if (level === "main") localStore.ivrCampFlowData.flow.waitTime = val;
    if (level === "repeatCount")
      localStore.ivrCampFlowData.flow.repeatCount = val;
    else if (level === "sub")
      localStore.ivrCampFlowData.flow.actions[dtmf_key - 1].waitTime = val;
    console.log("localStore.ivrCampFlowData = ", localStore.ivrCampFlowData);
    dispatch({ type: "SET_DATA", nState: localStore });
  };

  return (
    <>
      <div className="create__flow__component">
        <div className="create__flow__component__container">
          <div className="basic__flow__details__container">
            <div className="basic__flow__details__heading__container">
              <h1>Basic Flow Configuration</h1>
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
                    label="Flow Name"
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
                    Flow Channel
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={localStore.ivrCampFlowData.flow.channel}
                    label="Flow Channel"
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
                    {Object.keys(userFeatures).map((item) => {
                      if (
                        userFeatures[item].Incoming ||
                        userFeatures[item].Outgoing
                      ) {
                        return <MenuItem value={item}>{item}</MenuItem>;
                      }
                    })}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div
            className="call__flow__details__languages__dropdown__container"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <FormControl style={{ width: "40%" }}>
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
                Flow Languages
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={
                  // localStore.ivrCampFlowData.flow.language[0].actions
                  //   ? localStore.ivrCampFlowData.flow.language[0].actions.map(
                  //       (item) => item.languageName
                  //     )
                  //   :
                  ifIVRselectedThenLanguage
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
            {localStore.ivrCampFlowData.flow.language[0].actions.length > 1 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "40%",
                  }}
                >
                  <FormLabel
                    id="demo-radio-buttons-group-label"
                    style={{ fontSize: ".7rem" }}
                  >
                    Flow Default Language
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={
                      languageNames[
                        localStore.ivrCampFlowData.flow.defaultLanguage
                      ]
                    }
                  >
                    <div style={{ display: "flex" }}>
                      {ifIVRselectedThenLanguage.map((ele) => {
                        return (
                          <>
                            <FormControlLabel
                              value={ele}
                              control={<Radio />}
                              label={ele}
                              disabled={props.disableEditingWhileCreatingCamp}
                              onChange={() => {
                                localStore.languages.forEach((element) => {
                                  if (ele === element.lang) {
                                    localStore.ivrCampFlowData.flow.defaultLanguage =
                                      element.code;
                                  }
                                });
                                dispatch({
                                  type: "SET_DATA",
                                  nState: localStore,
                                });
                              }}
                            />
                          </>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>
              </>
            ) : (
              ""
            )}
          </div>

          {channel === "IVR" && (
            <>
              <div
                className="main__wait__time__container"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  marginTop: "1rem",
                }}
              >
                <Box
                  component="form"
                  style={{ width: "40%" }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id={"waitTime_" + global.dtmf_key}
                    disabled={
                      globalState.state.ivrCampFlowData.flow.channel == "SMS" ||
                      globalState.state.ivrCampFlowData.flow.channel == "SMS" ||
                      props.disableEditingWhileCreatingCamp
                    }
                    label="Flow Wait Time"
                    type="number"
                    name={"waitTime_" + global.dtmf_key}
                    value={globalState.state.ivrCampFlowData.flow.waitTime}
                    onChange={(e) => setWaitTime("main", e.target, null)}
                    onWheel={(e) => e.target.blur()}
                    variant="outlined"
                    required
                    error={
                      showError
                        ? parseInt(
                            globalState.state.ivrCampFlowData.flow.waitTime,
                            10
                          ) >= 0
                          ? false
                          : true
                        : false
                    }
                  />
                </Box>
                <Box
                  component="form"
                  style={{ width: "40%" }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id={"repeatCount_" + global.dtmf_key}
                    disabled={
                      globalState.state.ivrCampFlowData.flow.channel == "SMS" ||
                      globalState.state.ivrCampFlowData.flow.channel == "SMS" ||
                      props.disableEditingWhileCreatingCamp
                    }
                    label="Flow Repeat Count"
                    type="number"
                    name={"repeatCount_" + global.dtmf_key}
                    value={
                      globalState.state.ivrCampFlowData.flow.repeatCount
                        ? globalState.state.ivrCampFlowData.flow.repeatCount
                        : ""
                    }
                    onChange={(e) => setWaitTime("repeatCount", e.target, null)}
                    onWheel={(e) => e.target.blur()}
                    variant="outlined"
                    required
                    error={
                      showError
                        ? globalState.state.ivrCampFlowData.flow.repeatCount
                          ? false
                          : true
                        : false
                    }
                  />
                </Box>
              </div>

              <div
                className="create__flow__component__select__channel__dropdown__container"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  marginTop: "1rem",
                }}
              >
                <FormControl style={{ width: "40%" }}>
                  <InputLabel id="demo-simple-select-label">
                    Play Bargein
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={bargein}
                    label="Play bargein"
                    onChange={(e) => setBargein(e.target.value)}
                    disabled={props.disableEditingWhileCreatingCamp}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>

              </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginTop: "1rem",
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                >
                  <div style={{marginRight:".5rem" }}>
                    <input
                      type="checkbox"
                      id="thank-you-node"
                      checked={isThankYouNode}
                      onChange={(e) => handleThankYou(e)}
                      disabled={props.disableEditingWhileCreatingCamp}
                    />
                  </div>
                  <label style={{ }} htmlFor="thank-you-node">
                    Add Thank you node
                  </label>
                </div>
            </>
          )}

          <div className="call__flow__details__container">
            <div className="call__flow__details" style={{ marginTop: "1rem" }}>
              {channel && (
                <div className="call__flow__details__heading__container">
                  <h1>Flow Templete Creation</h1>
                </div>
              )}

              {channel === "IVR" ? (
                <IfIVRSelected
                  disableEditingWhileCreatingCamp={
                    props.disableEditingWhileCreatingCamp
                  }
                  hideItemStyle={props.hideItemStyle}
                  languageComponentProps={props}
                  isThankYouNode={isThankYouNode}
                />
              ) : (
                ""
              )}
              {/* {channel === "SMS" ? (
                <IfSMSSelected hideItemStyle={props.hideItemStyle} />
              ) : (
                ""
              )} */}
              {channel === "USSD" || channel === "SMS" ? (
                <IfUssdSelected
                  disableEditingWhileCreatingCamp={
                    props.disableEditingWhileCreatingCamp
                  }
                  hideItemStyle={props.hideItemStyle}
                  languageComponentProps={props}
                  isThankYouNode={isThankYouNode}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFlowComponent;

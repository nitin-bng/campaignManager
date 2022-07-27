import React, { useState, useContext } from "react";

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

import "./createFlowComponent.css";

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

const CreateFlowComponent = () => {
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
  const [selectChannel, setSelectChannel] = useState("");
  const [languages, setLanguages] = useState([]);

  const handleChange = (event) => {
    setChannel(event.target.value);
  };
  const handelFlowNameChange = (event) => {
    setFlowName(event.target.value);
  };
  const handleLanguageChange = (event) => {
    const {
      target: { value },
    } = event;

    setIfIVRselectedThenLanguage(typeof value === "string" ? value.split(",") : value);
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
                    value={flowName}
                    label="flow name"
                    variant="outlined"
                    onChange={handelFlowNameChange}
                  />
                </Box>
              </div>
              <div className="create__flow__component__select__channel__dropdown__container">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select channel
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={channel}
                    label="Select Channel"
                    onChange={handleChange}
                  >
                    {console.log(channel)}

                    <MenuItem value={"ivr"}>IVR</MenuItem>
                    <MenuItem value={"sms"}>SMS</MenuItem>
                    <MenuItem value={"ivr/sms"}>IVR/SMS</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="call__flow__details__container">
            <div className="call__flow__details__heading__container">
              <h1>Call Flow Details</h1>
            </div>
            <div className="call__flow__details">
              <div className="call__flow__details__languages__dropdown__container">
                <FormControl style={{ width: "50%" }}>
                  <InputLabel
                    style={{
                      backgroundColor: "white",
                      paddingRight: "4px",
                    }}
                    id="demo-multiple-checkbox-label"
                  >
                    Select Languages
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={ifIVRselectedThenLanguage}
                    onChange={handleLanguageChange}
                    input={<OutlinedInput label="Select language" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {Languages.map((Languages) => (
                      <MenuItem key={Languages} value={Languages}>
                        <Checkbox checked={ifIVRselectedThenLanguage.indexOf(Languages) > -1} />
                        <ListItemText primary={Languages} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="hello">
                {ifIVRselectedThenLanguage.indexOf("Hindi") !== -1 &&
                channel === "ivr" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={1}
                    lang="Hindi"
                    dtmfTime={dtmfTimeHindi}
                    setDtmfTime={setDtmfTimeHindi}
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("English") !== -1 &&
                channel === "ivr" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={2}
                    lang="English"
                    dtmfTime={dtmfTimeEnglish}
                    setDtmfTime={setDtmfTimeEnglish}
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Arabic") !== -1 &&
                channel === "ivr" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={3}
                    lang="Arabic"
                    dtmfTime={dtmfTimeArabic}
                    setDtmfTime={setDtmfTimeArabic}
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Spanish") !== -1 &&
                channel === "ivr" ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={4}
                    lang="Spanish"
                    dtmfTime={dtmfTimeSpanish}
                    setDtmfTime={setDtmfTimeSpanish}
                  />
                ) : (
                  ""
                )}

                {/* .................. sms .................. */}
                {ifIVRselectedThenLanguage.indexOf("Hindi") !== -1 &&
                channel === "sms" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Hindi" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("English") !== -1 &&
                channel === "sms" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="English" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Arabic") !== -1 &&
                channel === "sms" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Arabic" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Spanish") !== -1 &&
                channel === "sms" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Spanish" />
                ) : (
                  ""
                )}
              </div>

              {channel === "ivr" ? <IfIVRSelected /> : ""}
              {channel === "sms" ? <IfSMSSelected /> : ""}
            </div>
          </div>
          {/* <MainDTMF /> */}
        </div>
      </div>
    </>
  );
};

export default CreateFlowComponent;

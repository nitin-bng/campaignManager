import React, { useEffect } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import HelpIcon from "@mui/icons-material/Help";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import MenuAppBar from "../../components/topbar/MenuAppBar";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import "./userconfig.css";
import { blackout__days } from "../../helpers/All__mapping";
import { useState } from "react";
import { addDays } from "date-fns";
import moment from "moment";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css"; // theme css file

import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";

import DatePicker from "react-multi-date-picker";
import config from "../../ApiConfig/Config";

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

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 300,
  },
});

const BlackOutDayInfo = `
Blackout day
Blackout day means those days on which you don't want to run any campaignn
We can select multiple days
If you select all days your campian will not work
`;
const TotalChannelInfo = `
Total number of channels required
Total number of channels means
we can give only numeric values
Numeric values shouls be greater than 1 and lesser that 5
`;

const TotalNumerOfTPSRequiredInfo = `
Total number of TPS required
Total number of channels means
we can give only numeric values
Numeric values shouls be greater than 1 and lesser that 5
`;

const BlackoutStartHourInfo = `
Blackout start Hour
Blackout start hour mean the starting time for a particular day for which you don't want to run any campaignn
`;

const BlackoutEndHourInfo = `
Blackout end Hour
Blackout end hour mean the ending time for a particular day for which you want to resume any campaignn
`;

const BlackoutDateInfo = `
Blackout date
Blackout date means those dates on which you don't want to run any campian
You should not select previous dates

`;

const formJSON = [
  {
    page_label: "User Configuration Form",
    table_name: "user_configuration_table",
    fields: [
      {
        field_type: "header",
        field_id: "General_User_Configurations",
        header_id: 1,
        field_value: "",
        field_data: "varchar",
        field_size: 24,
        default_value: null,
        header_name: "General User Configurations",
      },
      {
        field_id: "Black_out_day",
        field_name: "Black out day",
        field_label: "Select black out day from above list",
        field_value: "",
        field_mandatory: "yes",
        field_options: [
          {
            option_label: "sunday",
          },
          {
            option_label: "monday",
          },
          {
            option_label: "teausday",
          },
          {
            option_label: "wednesday",
          },
          {
            option_label: "thursday",
          },
          {
            option_label: "friday",
          },
          {
            option_label: "saturday",
          },
        ],
        field_type: "select",
        field_data: "varchar",
        field_size: 16,
        default_value: null,
      },
      {
        field_id: "Required_channel",
        field_name: "Required channel",
        field_label: "Enter required channel here",
        field_mandatory: "yes",
        field_placeholder: "Enter required channel",
        field_type: "number",
        field_value: "",
        field_data: "numeric",
        field_size: 24,
        validation_type: "numeric",
        field_error: "enter a valid channel no",
        default_value: null,
      },
      {
        field_id: "Required_TPS",
        field_name: "Required TPS",
        field_label: "Enter required TPS here",
        field_mandatory: "yes",
        field_placeholder: "Enter required TPS",
        field_type: "number",
        field_value: "",
        field_data: "numeric",
        field_size: 24,
        validation_type: "numeric",
        field_error: "enter a valid TPS no",
        default_value: null,
      },
      {
        field_id: "Blackout_hour",
        field_name: "Blackout hour",
        field_label: "Select blackout hour",
        field_mandatory: "yes",
        field_type: "time",
        field_value: "",
        field_data: "varchar",
        field_size: 24,
        validation_type: "string",
        field_error: "select valid blackout hour ",
        default_value: null,
      },
      {
        field_id: "Blackout_date",
        field_name: "Blackout date",
        field_label: "Select blackout date",
        field_mandatory: "yes",
        field_type: "date",
        field_value: "",
        field_data: "varchar",
        field_size: 24,
        validation_type: "string",
        field_error: "select valid blackout date ",
        default_value: null,
      },
    ],
  },
];

const UserConfig = () => {
  const [assignChannel, setAssignChannel] = useState("");
  const [assignTps, setAssignTps] = useState("");
  const [msisdnLength, setMsisdnLength] = useState("");
  const [appendCountryCode, setAppendCountryCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [appendZero, setAppendZero] = useState("");
  const [startTimeToSendAtBackend, setStartTimeToSendAtBackend] = useState("");
  const [endTimeToSendAtBackend, setEndTimeToSendAtBackend] = useState("");

  const [blackOutDays, setBlackOutDays] = React.useState([]);
  const [blackoutStartHour, setBlackoutStartHour] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [blackoutEndHour, setBlackoutEndHour] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [blackoutDate, setBlackoutDate] = React.useState([]);
  const [value, setValue] = useState([]);
  const [createUpdate, setCreateUpdate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [scheduleData1, setScheduleData] = useState({});
  const [elements, setElements] = useState(null);

  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());

  const [getChannel, setGetChannel] = useState();
  const [getTps, setGetTps] = useState();
  const [dayName, setDayName] = useState([]);
  const [values, setValues] = useState([]);
  const [getEndHour, setgetEndHour] = useState();
  const initialValues = {
    requiredChannel: "",
    days: "",
    totalTps: "",
    date: "",
    startTime: "",
    endTime: "",
  };

  const [formValues, setFormValues] = useState(initialValues);

  var scheduleData = {};

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setBlackOutDays(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleblackoutStartHourChange = (newblackoutStartHour) => {
    setBlackoutStartHour(newblackoutStartHour);
  };
  const handleblackoutEndHourChange = (newblackoutHour) => {
    setBlackoutEndHour(newblackoutHour);
  };

  const userConfigSubmit = (event) => {
    localStorage.setItem("createFlowInMenuBarDisbled", true);

    // console.log("blackoutDate", blackoutDate);
    event.preventDefault();

    scheduleData = {
      assignChannel: assignChannel,
      assignTps: assignTps,
      msisdnLength: msisdnLength,
      appendCountryCode: appendCountryCode,
      countryCode: countryCode,
      appendZero: appendZero,
      days: blackOutDays,
      date: blackoutDate,
      startTime: startTimeToSendAtBackend,
      endTime: endTimeToSendAtBackend,
    };

    // console.log("schedule Data ", scheduleData);
    // setFormErrors(validate(formValues));
    // if (Object.keys(errors).length == 0) {
    fetch(
      config.server.path +
        config.server.port3+
        "/" +
        localStorage.getItem("userType") +
        config.api.createUserConfig +
        localStorage.getItem("userId"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      }
    )
      .then((res) => {
        res.json().then((res) => {
          if (res.status == "successful") {
            setCreateUpdate(true);
            setShowSuccess(true);
            // console.log(res);
          } else if (res.status == "unsuccessful") {
            setReason(res.reason);
            setStatus(res.status);
            setOpenModal(true);
          }
        });
      })
      .catch((e) => {
        // console.log(e);
      });
    // }
  };

  const handleConfirm = () => {
    setShowSuccess(false);
  };
  const handleModal = () => {
    setOpenModal(false);
    if (
      status === "unsuccessful" &&
      reason === "Only Required channel = 9 and Required TPS = 9 are available."
    ) {
      // history.push({
      //     pathname: '/Configuration/User',
      //     state: { detail: 'true' }
      // });
    }
  };
  useEffect(() => {
    setElements(formJSON[0]);
    console.log(formJSON);
    fetch(
      "http://34.214.61.86" +
        ":" +
        "8087/" +
        localStorage.getItem("userType") +
        "/getConfig" +
        "/" +
        localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        res.json().then((res) => {
          var formatedData = [];
          var dateData = [];
          console.log("rishabh", res);
          if (res.status === "successful" && res.requiredChannel != 0) {
            debugger;
            for (var i = 0; i < res.date.length; i++) {
              //    var key = res.data[i].split("T")
              dateData.push(res.date[i].split("T")[0]);
              formatedData.push(moment(res.date[i].split("T")[0]).toString());
            }
            setCreateUpdate(true);
            setGetChannel(res.requiredChannel);
            setGetTps(res.totalTps);
            // setDayName(res.days)
            console.log("nitin", res);
            setBlackOutDays(res.days);
            setAssignChannel(res.assignChannel)
            setAssignTps(res.assignTps)
            setBlackoutDate(res.date)
            setValue(res.date)
            setAppendZero(res.appendZero)
            setCountryCode(res.countryCode)
            setAppendCountryCode(res.appendCountryCode)
            setMsisdnLength(res.msisdnLength)
            setBlackoutStartHour(res.startTime)
            setBlackoutEndHour(res.endTime)

            if (res.startTime == null) {
              handleStartDateChange(new Date());
            } else {
              handleStartDateChange(res.startTime);
            }
            if (res.endTime == null) {
              handleEndDateChange(new Date());
            } else {
              handleEndDateChange(res.endTime);
            }
            // setGetDate(res.date)
            setValues(formatedData);
            setgetEndHour(res.endTime);
            scheduleData = {
              days: res.days,
              requiredChannel: res.requiredChannel,
              totalTps: res.totalTps,
              date: dateData,
              startTime: moment(res.startTime).format("HH:MM:SS"),
              endTime: moment(res.endTime).format("HH:MM:SS"),
            };
            setFormValues({
              ...formValues,
              days: res.days,
              requiredChannel: res.requiredChannel,
              totalTps: res.totalTps,
              date: dateData,
              startTime: moment(res.startTime).format("HH:MM:SS"),
              endTime: moment(res.endTime).format("HH:MM:SS"),
            });

            setScheduleData((scheduleData1) => ({
              ...scheduleData1,
              ...scheduleData,
            }));
          } else if (res.length == 0) {
            // showError(true)
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  console.log("blackout days from PI", blackOutDays);

  return (
    <>
      <div className="userconfig">
        <div className="userconfig__container">
          <div className="navbar__container">
            <div className="navbar">
              <MenuAppBar />
            </div>
          </div>
          <div className="userconfig__maincontent__container">
            <div className="userconfig__maincontent">
              <div className="userconfig__maincontent__heading">
                <h1>General User Configuration</h1>
              </div>

              {!showSuccess ? (
                <div className="userconfig__maincontent__form__container">
                  <div className="userconfig__maincontent__form">
                    <div className="userconfig__maincontent__form__inside__containers userconfig__blackoutday__dropdown__container">
                      <FormControl style={{ width: "80%" }}>
                        <InputLabel
                          style={{
                            backgroundColor: "white",
                            paddingRight: "4px",
                          }}
                          id="demo-multiple-checkbox-label"
                        >
                          Black out day
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={blackOutDays}
                          onChange={handleChange}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                        >
                          {blackout__days.map((blackout__days) => (
                            <MenuItem
                              key={blackout__days}
                              value={blackout__days}
                            >
                              <Checkbox
                                checked={
                                  blackOutDays.indexOf(blackout__days) > -1
                                }
                              />
                              <ListItemText primary={blackout__days} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <CustomWidthTooltip title={BlackOutDayInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__required__channel__container">
                      <Box
                        component="form"
                        style={{ width: "80%" }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="userconfig__required__channel__required"
                          type="number"
                          label="Number of channels required"
                          variant="outlined"
                          value={assignChannel}
                          onChange={(e) => {
                            setAssignChannel(e.target.value);
                          }}
                        />
                      </Box>
                      <CustomWidthTooltip title={TotalChannelInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__required__tps__container">
                      <Box
                        component="form"
                        style={{ width: "80%" }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="userconfig__required__tps__required"
                          type="number"
                          label="Number of tps required"
                          variant="outlined"
                          value={assignTps}
                          onChange={(e) => {
                            setAssignTps(e.target.value);
                          }}
                        />
                      </Box>
                      <CustomWidthTooltip title={TotalNumerOfTPSRequiredInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__blackout-start-hour__container">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack style={{ width: "80%" }} spacing={3}>
                          <TimePicker
                            label="Blackout start hour"
                            value={blackoutStartHour}
                            onChange={(e) => {
                              handleblackoutStartHourChange(e);
                              var starttime =
                                e.getHours().toString() +
                                ":" +
                                e.getMinutes().toString() +
                                ":" +
                                e.getSeconds().toString();
                              setStartTimeToSendAtBackend(starttime);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Stack>
                      </LocalizationProvider>

                      <CustomWidthTooltip title={BlackoutStartHourInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__blackout-end-hour__container">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack style={{ width: "80%" }} spacing={3}>
                          <TimePicker
                            label="Blackout end hour"
                            value={blackoutEndHour}
                            onChange={(e) => {
                              handleblackoutEndHourChange(e);
                              var endtime =
                                e.getHours().toString() +
                                ":" +
                                e.getMinutes().toString() +
                                ":" +
                                e.getSeconds().toString();
                              setEndTimeToSendAtBackend(endtime);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Stack>
                      </LocalizationProvider>
                      <CustomWidthTooltip title={BlackoutEndHourInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__blackout__date__picker__container">
                      <DatePicker
                        value={blackoutDate}
                        multiple
                        onChange={(e) => {
                          e.map((ele, idx) => {
                            // console.log(ele.day);
                            // console.log(e);
                            // console.log(ele.year);
                            // console.log(ele.month.number);
                            blackoutDate[idx] =
                              ele.year + "/" + ele.month.number + "/" + ele.day;
                            setBlackoutDate(blackoutDate);
                            setValue(blackoutDate);
                          });
                          // console.log(blackoutDate);
                          // setValue
                        }}
                      />

                      <CustomWidthTooltip title={BlackoutDateInfo}>
                        <HelpIcon
                          className="helpicon"
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__append__zero__container">
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Append Zero
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={appendZero}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                            onChange={(e) => {
                              setAppendZero(e.target.value);
                              // console.log(e);
                            }}
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            onChange={(e) => {
                              setAppendZero(e.target.value);
                              // console.log(e);
                            }}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                      <CustomWidthTooltip title={TotalChannelInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__country__code__container">
                      <Box
                        component="form"
                        style={{ width: "80%" }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="userconfig__required__channel__required"
                          type="number"
                          label="Country code"
                          value={countryCode}
                          onChange={(e) => {
                            setCountryCode(e.target.value);
                          }}
                          variant="outlined"
                        />
                      </Box>
                      <CustomWidthTooltip title={TotalChannelInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__append__country__code__container">
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Append Country Code
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={appendCountryCode}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                            onChange={(e) => {
                              setAppendCountryCode(e.target.value);
                            }}
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            onChange={(e) => {
                              setAppendCountryCode(e.target.value);
                            }}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                      <CustomWidthTooltip title={TotalChannelInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>

                    <div className="userconfig__maincontent__form__inside__containers userconfig__mobile__number__length__container">
                      <Box
                        component="form"
                        style={{ width: "80%" }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="userconfig__required__channel__required"
                          type="number"
                          label="Mobile number length"
                          variant="outlined"
                          value={msisdnLength}
                          onChange={(e) => {
                            setMsisdnLength(e.target.value);
                          }}
                        />
                      </Box>
                      <CustomWidthTooltip title={TotalChannelInfo}>
                        <HelpIcon
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            fontSize: "1.3rem",
                          }}
                        />
                      </CustomWidthTooltip>
                    </div>
                  </div>
                  <div className="userconfig__maincontent__form__submit__button__container">
                    <Stack spacing={2} direction="row">
                      <Button onClick={userConfigSubmit} variant="contained">
                        {createUpdate ? "Update" : "Submit"}
                      </Button>
                    </Stack>
                  </div>
                </div>
              ) : (
                <div className="successCard">
                  <div className="successIcon">
                    <i className="checkmark">✓</i>
                  </div>
                  <h1>Success</h1>
                  <button
                    type="submit"
                    className="btn btn-primary submitJob"
                    onClick={(e) => handleConfirm(e)}
                  >
                    Finish!!
                  </button>
                </div>
              )}
            </div>
          </div>

          {openModal && (
            <div className="bg-modal" style={{ marginLeft: "-17%" }}>
              <div
                className="modal-content"
                style={{ width: "25%", height: "22%" }}
              >
                <h3 className="title" style={{ fontSize: "13px" }}>
                  {reason}
                </h3>
                <button
                  className="closeBtn"
                  style={{ width: "20%" }}
                  onClick={(e) => handleModal(e)}
                >
                  Okay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserConfig;

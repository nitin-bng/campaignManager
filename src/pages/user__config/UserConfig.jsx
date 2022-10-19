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

import MenuAppBar from "../../components/topbar/MenuAppBar";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import "./userconfig.css";
import { blackout__days } from "../../helpers/All__mapping";
import { useState } from "react";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import DatePicker from "react-multi-date-picker";
import config from "../../ApiConfig/Config";
import {
  getMultipleDatesInFormat,
} from "../../services/getDateInFormat";
import {changeTimeFormatForFrontend, changeTimeFormatForBackend} from "../../services/getTimeInFormat"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
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
Blackout day means those days on which you don't want to run any campaignn
You can select multiple days
If you select all days your campian will not work
`;
const TotalChannelInfo = `
we can give only numeric values
Numeric values shouls be greater than 1 and lesser that 5
`;

const TotalNumerOfTPSRequiredInfo = `
we can give only numeric values
Numeric values shouls be greater than 1 and lesser that 5
`;

const BlackoutStartHourInfo = `
Blackout start hour mean the starting time for a particular day for which you don't want to run any campaignn
`;

const BlackoutEndHourInfo = `
Blackout end hour mean the ending time for a particular day for which you want to resume any campaignn
`;

const BlackoutDateInfo = `
Blackout date means those dates on which you don't want to run any campian
You should not select previous dates
`;

const MobileNumberWithLeadingZeros = `
Mobile Number with leading Zeros means the number list that you will upload of mobile numbers will have zeros in the start or not
`;

const CountryCodeHelpIcon = `
Country code means the two digit code of mobile number of your country
`;

const MobileNumberWithCountryCode = `
Mobile Number with Country Code means the number list that you will upload of mobile numbers will have country code with them or not 
`;

const MobileNumberLength = `
Mobile Number Length means the the count of digits of mobile number in your country without zeros or country code
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
  const [expanded, setExpanded] = React.useState(true);
  const [expanded2, setExpanded2] = React.useState(true);
  const [expanded3, setExpanded3] = React.useState(true);
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
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick2 = () => {
    setExpanded2(!expanded2);
  };
  const handleExpandClick3 = () => {
    setExpanded3(!expanded3);
  };

  const [assignChannel, setAssignChannel] = useState("");
  const [assignTps, setAssignTps] = useState("");
  const [msisdnLength, setMsisdnLength] = useState("");
  const [appendCountryCode, setAppendCountryCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [appendZero, setAppendZero] = useState("");
  const [startTimeToSendAtBackend, setStartTimeToSendAtBackend] = useState("");
  const [endTimeToSendAtBackend, setEndTimeToSendAtBackend] = useState("");
  const [blackOutDays, setBlackOutDays] = React.useState([]);
  const [blackoutStartHour, setBlackoutStartHour] = React.useState('00:00:00');
  const [blackoutEndHour, setBlackoutEndHour] = React.useState('00:00:00');
  const Navigate = useNavigate();
  const [blackoutDate, setBlackoutDate] = React.useState([]);
  const [createUpdate, setCreateUpdate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState("");
  const [configError, setConfigError] = useState('')
  const initialValues = {
    requiredChannel: "",
    days: "",
    totalTps: "",
    date: "",
    startTime: "00:00:00",
    endTime: "00:00:00",
  };

  const [formValues, setFormValues] = useState(initialValues);

  var scheduleData = {};

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setBlackOutDays(
      value ? typeof value === "string" ? value.split(",") : value : []
    );
  };

  const handleblackoutStartHourChange = (newblackoutStartHour) => {
    setBlackoutStartHour(newblackoutStartHour);
  };
  const handleblackoutEndHourChange = (newblackoutHour) => {
    setBlackoutEndHour(newblackoutHour);
  };

  const userConfigSubmit = (event) => {
    setConfigError('')
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
      startTime: startTimeToSendAtBackend || "00:00:00",
      endTime: endTimeToSendAtBackend || "00:00:00",
    };
    
    if((startTimeToSendAtBackend || endTimeToSendAtBackend) && !(startTimeToSendAtBackend && endTimeToSendAtBackend)){
      if(!startTimeToSendAtBackend){
        setConfigError('Please Enter Start time')
      }
      else if(!endTimeToSendAtBackend){
        setConfigError('Please Enter End time')
      }
    }
    else if(!countryCode){
      setConfigError('Please Enter Country Code')
    }
    else if(!msisdnLength){
      setConfigError('Please Enter Mobile Number length')
    }
    else if (assignChannel === '' || ~~assignChannel === 0){
      setConfigError('Please Enter Simultaneous outgoing calls')
    }
    else if (assignTps === '' || ~~assignTps === 0){
      setConfigError('Please Enter SMS TPS required')
    }
    else{fetch(
      config.server.path +
        config.server.port3 +
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
            Navigate("/campaign-manager/home");
            toast("You can create flow now");
            localStorage.setItem("createFlowInMenuBarDisbled", true);
          } else if (res.status == "unsuccessful") {
            setReason(res.reason);
            setOpenModal(true);
          }
        });
      })
      .catch((e) => {
      })}
  };

  const handleConfirm = () => {
    setShowSuccess(false);
  };
  const handleModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    console.log(formJSON);
    fetch(
      config.server.path + config.server.port3+"/"+localStorage.getItem("userType") +"/getConfig" +"/" +localStorage.getItem("userId"),
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
              dateData.push(res.date[i].split("T")[0]);
              formatedData.push(moment(res.date[i].split("T")[0]).toString());
            }
            setCreateUpdate(true);
            setBlackOutDays(res.days);
            setAssignChannel(res.assignChannel);
            setAssignTps(res.assignTps);
            setBlackoutDate(res.date.map(item=>item.slice(0,10)));
            setAppendZero(res.appendZero);
            setCountryCode(res.countryCode);
            setAppendCountryCode(res.appendCountryCode);
            setMsisdnLength(res.msisdnLength);
            setBlackoutStartHour(changeTimeFormatForFrontend(res.startTime));
            setBlackoutEndHour(changeTimeFormatForFrontend(res.endTime));
            setStartTimeToSendAtBackend(res.startTime)
            setEndTimeToSendAtBackend(res.endTime)
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
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

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
                <>
                  <div className="userconfig__maincontent__form__container">
                    <div className="userconfig__maincontent__form">
                      <Card
                        style={{
                          backgroundColor: "#e4e4e4",
                          padding: ".5rem",
                          marginTop: "1rem",
                          overflow:"visible"
                        }}
                        fullWidth
                      >
                        <CardActions disableSpacing>
                          <Typography paragraph>
                            <b>Blackout period configurations </b>
                          </Typography>
                          <ExpandMore
                            expand={expanded3}
                            onClick={handleExpandClick3}
                            aria-expanded={expanded3}
                            aria-label="show more"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <ExpandMoreIcon />
                          </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded3} timeout="auto" unmountOnExit>
                          <CardContent
                            style={{
                              padding: "0rem 0rem 1rem 0rem",
                              height: "100%",
                            }}
                          >
                            <div className="section">
                              <div className="userconfig__maincontent__form__inside__containers userconfig__blackoutday__dropdown__container">
                                <FormControl style={{ width: "80%" }}>
                                  <InputLabel
                                    style={{
                                      backgroundColor: "#e4e4e4",
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
                                    renderValue={(selected) =>
                                      selected.join(", ")
                                    }
                                    MenuProps={MenuProps}
                                  >
                                    {blackout__days.map((blackout__days) => (
                                      <MenuItem
                                        key={blackout__days}
                                        value={blackout__days}
                                      >
                                        <Checkbox
                                          checked={
                                            blackOutDays.indexOf(
                                              blackout__days
                                            ) > -1
                                          }
                                        />
                                        <ListItemText
                                          primary={blackout__days}
                                        />
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

                              <div className="userconfig__maincontent__form__inside__containers userconfig__blackout-start-hour__container">
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <Stack style={{ width: "80%" }} spacing={3}>
                                    <TimePicker
                                      label="Blackout start hour"
                                      value={blackoutStartHour}
                                      onChange={(e) => {
                                        handleblackoutStartHourChange(e);                                          
                                        setStartTimeToSendAtBackend(changeTimeFormatForBackend(e));
                                      }}
                                      renderInput={(params) => (
                                        <TextField {...params} />
                                      )}
                                    />
                                  </Stack>
                                </LocalizationProvider>

                                <CustomWidthTooltip
                                  title={BlackoutStartHourInfo}
                                >
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
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <Stack style={{ width: "80%" }} spacing={3}>
                                    <TimePicker
                                      label="Blackout end hour"
                                      value={blackoutEndHour}
                                      onChange={(e) => {
                                        handleblackoutEndHourChange(e);
                                        setEndTimeToSendAtBackend(changeTimeFormatForBackend(e));
                                      }}
                                      renderInput={(params) => (
                                        <TextField {...params} />
                                      )}
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

                              <div
                                className="userconfig__maincontent__form__inside__containers userconfig__blackout__date__picker__container"
                                style={{
                                  width: "20%",
                                  position: "relative",
                                  zIndex: "999",
                                  overflow:"visible"
                                }}
                              >
                                <InputLabel
                                  style={{
                                    padding: "0 5px",
                                    backgroundColor: "#e4e4e4",
                                    position: "absolute",
                                    top: "-8px",
                                    left: "10px",
                                    zIndex: "1000",
                                    fontSize: "12px",
                                    color: "grey",
                                  }}
                                >
                                  Dates
                                </InputLabel>
                                <DatePicker
                                  style={{
                                    backgroundColor: "#e4e4e4",
                                    width: "100%",
                                    height: "100%",
                                    zIndex:"1001",
                                    
                                  }}
                                  value={blackoutDate}
                                  multiple
                                  onChange={(e) => {
                                    let newDate = new Set()
                                    e.map((ele, idx) => {
                                      newDate.add(getMultipleDatesInFormat(ele))
                                    });
                                    console.log('date after', newDate)
                                    setBlackoutDate([...newDate]);
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
                            </div>
                          </CardContent>
                        </Collapse>
                      </Card>

                      <Card
                        style={{
                          backgroundColor: "#e4e4e4",
                          padding: ".5rem",
                          marginTop: "1rem",
                        }}
                        fullWidth
                      >
                        <CardActions disableSpacing>
                          <Typography paragraph>
                            <b>Configure your mobile number details </b>{" "}
                          </Typography>
                          <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <ExpandMoreIcon />
                          </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                          <CardContent
                            style={{
                              padding: "0rem 0rem 1rem 0rem",
                              height: "100%",
                            }}
                          >
                            <div className="section">
                              <div className="userconfig__maincontent__form__inside__containers userconfig__append__zero__container">
                                <FormControl>
                                  <FormLabel id="demo-row-radio-buttons-group-label">
                                    Mobile number with leading zero
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
                                      }}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      onChange={(e) => {
                                        setAppendZero(e.target.value);
                                      }}
                                      label="No"
                                    />
                                  </RadioGroup>
                                </FormControl>
                                <CustomWidthTooltip title={MobileNumberWithLeadingZeros}>
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
                                    onWheel={(e) => e.target.blur()}
                                    variant="outlined"
                                  />
                                </Box>
                                <CustomWidthTooltip title={CountryCodeHelpIcon}>
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
                                    Mobile number country code
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
                                <CustomWidthTooltip title={MobileNumberWithCountryCode}>
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
                                    label="Mobile number length without country code"
                                    variant="outlined"
                                    value={msisdnLength}
                                    onChange={(e) => {
                                      setMsisdnLength(e.target.value);
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                  />
                                </Box>
                                <CustomWidthTooltip title={MobileNumberLength}>
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
                          </CardContent>
                        </Collapse>
                      </Card>

                      <Card
                        style={{
                          backgroundColor: "#e4e4e4",
                          padding: ".5rem",
                          marginTop: "1rem",
                          marginBottom: "2rem",
                        }}
                        fullWidth
                      >
                        <CardActions disableSpacing>
                          <Typography paragraph>
                            <b>Configure your TPS and channels </b>
                          </Typography>
                          <ExpandMore
                            expand={expanded2}
                            onClick={handleExpandClick2}
                            aria-expanded={expanded2}
                            aria-label="show more"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <ExpandMoreIcon />
                          </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded2} timeout="auto" unmountOnExit>
                          <CardContent
                            style={{
                              padding: "0rem 0rem 1rem 0rem",
                              height: "100%",
                            }}
                          >
                            <div className="section">
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
                                    label="Simultaneous outgoing calls "
                                    variant="outlined"
                                    value={assignChannel}
                                    onChange={(e) => {
                                       setAssignChannel((e.target.value >= 1 || e.target.value === '') ? e.target.value : 1)
                                    }}
                                    onWheel={(e) => e.target.blur()}
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
                                    label="SMS TPS required"
                                    variant="outlined"
                                    value={assignTps}
                                    onChange={(e) => {
                                     setAssignTps((e.target.value >= 1 || e.target.value === '') ? e.target.value : 1)
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                  />
                                </Box>
                                <CustomWidthTooltip
                                  title={TotalNumerOfTPSRequiredInfo}
                                >
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
                          </CardContent>
                        </Collapse>
                      </Card>
                    </div>
                  </div>
                  <div className="userconfig__maincontent__form__submit__button__container">
                    <Stack spacing={2} direction="row">
                      <Button onClick={userConfigSubmit} variant="contained" style={{ backgroundColor:"#374151", textShadow:"2px 2px 2px black"}}>
                        {createUpdate ? "Update" : "Submit"}
                      </Button>
                    </Stack>
                  </div>
                  <div style={{color:"red", display: "flex", justifyContent:"center"}}>{configError}</div>
                </>
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
            <div className="bg-modal"           
            style={{ position: "fixed", left: "0", top: "0" }}
            >
              <div
                className="modal-content"
                style={{ width: "50%", height: "50%" }}
              >
                <h3 className="title" style={{ fontSize: "13px" }}>
                  {reason}
                </h3>
                <button
                  className="closeBtn"
                  style={{
                    padding: ".5rem 1rem",
                    border: "none",
                    outline: "none",
                    backgroundColor: " #374151",
                    color: "white",
                    textTransform: "uppercase",
                    textShadow: "1px 1px 2px black",
                    width: "10%",
                    marginBottom: "1rem",
                    transition: "all 0.5s",
                    fontWeight: "700",
                  }}
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

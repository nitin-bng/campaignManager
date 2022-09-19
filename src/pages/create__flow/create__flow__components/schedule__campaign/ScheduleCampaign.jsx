import React from "react";

import "./scheduleCampaign.css";
import { useState, useEffect, useContext } from "react";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import { KeyboardTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import PublishIcon from "@material-ui/icons/Publish";
import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getDateInFormat } from "../../../../services/getDateInFormat";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import Stack from "@mui/material/Stack";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useError } from "../../../../store/errorContext";

import DatePicker from "react-multi-date-picker";
import { store } from "../../../../store/store";
// import DateRangePicker from 'rsuite/DateRangePicker';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useNavigate } from "react-router-dom";
import "../create__campaign/createCampaign.css";
import { CircularProgress } from "@material-ui/core";
import { toast } from "react-toastify";
var rows = [];
const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
  tr: {
    textAlign: "center",
  },
});
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function createData(jobId, jobName, priority, status) {
  return { jobId, jobName, priority, status };
}
let localDate = new Date();

const ScheduleCampaign = (props) => {
  const Navigate = useNavigate();
  const { showError } = useError();
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [openCancelModal, setCancelModal] = useState(false);
  const todaysDate = {
    startDate: new Date(),
    endDate: null,
  };

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  console.log("todaydate", state[0].startDate);

  const [selectedStartDate, handleStartDateChange] = useState("");
  const [selectedEndDate, handleEndDateChange] = useState("");
  const [selectedBlackoutStartDate, handleBlackoutStartDate] = useState(
    new Date()
  );
  const [selectedBlackoutEndDate, handleBlackoutEndDate] = useState(new Date());
  const [fileName, setfileName] = useState(null);
  const [scheduleData1, setScheduleData] = useState({});
  var [form, showForm] = useState(false);
  var [tabledata, setData] = useState([]);
  var [update, updateForm] = useState(false);
  var [success, showSuccess] = useState(false);
  const [stringInputError, handlestringInputError] = useState(false);
  const [campaignListData, setCampaignListData] = useState([]);
  const classes = useStyles();
  const scheduleData = {};
  const globalState = useContext(store);
  let localStore = globalState.state;
  const languages = globalState.state.languages;

  const {
    setCampaignName,
    campaignName,
    campaignSchedulePriority,
    setCampaignSchedulePriority,
  } = globalState;
  var blackoutDay = [];
  const weekDaya = [
    { Day: "sunday", id: 1 },
    { Day: "monday", id: 2 },
    { Day: "teausday", id: 3 },
    { Day: "wednesday", id: 4 },
    { Day: "thursday", id: 5 },
    { Day: "friday", id: 6 },
    { Day: "saturday", id: 7 },
  ];
  const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
  ];
  const initialValues = {
    jobName: { campaignName },
    priority: { campaignSchedulePriority },
    campaignId: "",
    Channel: "",
    Country: "",
    Operator: "",
    dayStartTime:
      localDate.getHours() +
      ":" +
      localDate.getMinutes() +
      ":" +
      localDate.getSeconds(),
    dayEndTime:
      localDate.getHours() +
      ":" +
      localDate.getMinutes() +
      ":" +
      localDate.getSeconds(),
    dateRange: "",
    file: "",
  };
  const [options] = useState(weekDaya);
  const [selectedDayValue, setSelectedDayValue] = useState([]);

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  var errors;

  useEffect(() => props.setDisableNext(true), []);

  useEffect(() => {
    debugger;
    if (localStorage.getItem("operatorName")) {
      scheduleData["operator"] = localStorage.getItem("operatorName");
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    }
    if (
      (localStorage.getItem("channelName") &&
        (localStorage.getItem("channelName") == "IVR" ||
          localStorage.getItem("channelName") == "SMS")) ||
      localStorage.getItem("channelName") == "USSD"
    ) {
      scheduleData["channel"] = localStorage.getItem("channelName");
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    }
    getCampaignDataList();
    getcampaignScheduleList();
  }, []);
  const getcampaignScheduleList = () => {
    fetch(
      `http://34.214.61.86" + ":" + "5002" + "/bng/ui/list/campschedule?userId=${localStorage.getItem(
        "userId"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        res.json().then((res) => {
          if (res.length > 0) {
            rows = [];
            res.map((params) => {
              rows.push(
                createData(
                  params.jobId,
                  params.jobName,
                  params.priority,
                  params.status
                )
              );
            });
            setData(rows);
          } else if (res.length == 0) {
            setData([]);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getCampaignDataList = () => {
    const path = `http://34.214.61.86:5002/bng/ui/list/campaign?userId=${localStorage.getItem(
      "userId"
    )}`;
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        console.log("get flowList", data);
        data.unshift({ campName: "select" });
        setCampaignListData(data);
        data.forEach((element) => {
          console.log("rishabh running runnig");
          console.log("===========>", element.campName, campaignName);
          // console.log(campaignName);
          if (element.campName == campaignName) {
            console.log("rishabh running runnig");
            setScheduleData((prev) => {
              return {
                ...prev,
                campId: element.campId,
              };
            });

            setFormValues((prev) => {
              return {
                ...prev,
                campaignId: element.campId,
              };
            });
          }
        });
        return data;
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  };
  const validateData = (e) => {
    const letters = /^[ A-Za-z_@./#&+-]*$/;
    if (e.target.value.match(letters)) {
      handlestringInputError(false);
      return;
    } else {
      // alert("message");
      // setCurrentFieldId(id)
      handlestringInputError(true);
    }
  };
  const handleChange = (e, catagory) => {
    debugger;
    if (catagory == "dayStartTime" || catagory == "dayEndTime") {
      setFormValues({ ...formValues, [catagory]: e });
    } else {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    }
    if (e != null && e.target !== undefined) {
      if (e.target.id == "jobName") {
        validateData(e);
        scheduleData["jobName"] = e.target.value.replace(/ /g, "");
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.name == "priority") {
        scheduleData["priority"] = e.target.value;
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.name == "campaignId") {
        scheduleData["campId"] = e.target.value;
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.id == "Channel") {
        scheduleData["channel"] = e.target.value;
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.id == "Country") {
        scheduleData["country"] = e.target.value;
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.id == "Operator") {
        scheduleData["operator"] = e.target.value;
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.id == "selectDate") {
        if (e.target.value != null) {
          scheduleData["startDate"] = e.target.value[0];
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
          scheduleData["endDate"] = e.target.value[1];
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
        } else if (e.target.value == null) {
          scheduleData["startDate"] = "";
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
          scheduleData["endDate"] = "";
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
        }
      } else if (e.target.id == "selectBlackoutDate") {
        scheduleData["startBlackoutDate"] =
          e.target.value[0] + "T00:00:00.000Z";
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
        scheduleData["endBlackoutDate"] = e.target.value[1] + "T00:00:00.000Z";
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.id == "selectBlackoutDay") {
        debugger;
        //   blackoutDay = e.target.value;
        blackoutDay = e.target.value;
        console.log(blackoutDay);
      } else if (e.target.id == "uploadCsvFfile") {
        setShowLoader(true);
        let files = e.target.files;
        var formData = new FormData();
        formData.append("file", files[0]);
        fetch(
          // "http://34.214.61.86" + ":" + "5002" + "/bng/ui/uploadMsisdn",
          `http://34.214.61.86:5002/bng/ui/uploadMsisdn?userId=${localStorage.getItem(
            "userId"
          )}&channel=${localStorage.getItem("channelName")}`,
          {
            method: "POST",
            body: formData,
          }
        )
          .then((res) => {
            res.json().then((res) => {
              if (res.status === "successful") {
                // localStorage.setItem("selctedFile", res.fileName)
                // newFileName = res.fileName
                setfileName(res.fileName);
                scheduleData["fileName"] = res.fileName;
                scheduleData["reserveBalance"] = res.reserve_balance;
                setScheduleData((scheduleData1) => ({
                  ...scheduleData1,
                  ...scheduleData,
                }));
              } else if (res.status === "unsuccessful") {
                setShowLoader(false);
                setErrorMessage(res.reason);
              }
            });
            setShowLoader(false);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      if (catagory == "dayStartTime") {
        if (e != null) {
          scheduleData["dailyStartTime"] =
            e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
          handleStartDateChange(e);
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
        } else if (e == null) {
          scheduleData["dailyStartTime"] = "";
          handleStartDateChange(e);
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
        }
      } else if (catagory == "dayEndTime") {
        if (e != null) {
          scheduleData["dailyEndTime"] =
            e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
          handleEndDateChange(e);
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
        } else if (e == null) {
          scheduleData["dailyEndTime"] = "";
          handleEndDateChange(e);
          setScheduleData((scheduleData1) => ({
            ...scheduleData1,
            ...scheduleData,
          }));
        }
      } else if (catagory == "startBlackoutTime") {
        scheduleData["blackoutStartTime"] =
          e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
        handleBlackoutStartDate(e);
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (catagory == "endBlackoutTime") {
        scheduleData["blackoutEndTime"] =
          e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
        handleBlackoutEndDate(e);
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      }
    }
    // console.log("scheduleData1::", scheduleData1);

    console.log(scheduleData);
  };
  const handleDayChange = (event, values) => {
    debugger;
    // setSelectedDayValue(Array.isArray(val) ? val.map(x => x.value) : []);
    console.log(selectedDayValue);
  };
  const validate = (values) => {
    debugger;
    errors = {};

    if (!values.jobName) {
      errors.jobName = "jobName is required!";
    }
    if (!values.priority) {
      errors.priority = "priority is required!";
    }
    if (!values.campaignId) {
      errors.campaignId = "campaignId is required";
    }
    if (!values.Channel) {
      if (
        localStorage.getItem("channelName") &&
        localStorage.getItem("channelName") == "IVR_SMS"
      ) {
        errors.Channel = "Channel is required";
      } else if (!localStorage.getItem("channelName")) {
        errors.Channel = "Channel is required";
      }
    }
    //   if (!values.Country) {
    //     errors.Country = "Country is required";
    //   }
    // if (!values.Operator && !localStorage.getItem("operatorName")) {
    //   errors.Operator = "Operator is required";
    // }
    // if (!values.dayStartTime) {
    //   errors.dayStartTime = "startTime is required";
    // }
    // if (!values.dayEndTime) {
    //   errors.dayEndTime = "endTime is required";
    // }
    // if (!values.dateRange) {
    //   errors.dateRange = "date is required";
    // }
    if (!values.file) {
      errors.file = "csv file is required";
    }
    return errors;
  };

  const checkDateAndTime = () => {
    const date = new Date();
    const startTimeArray = scheduleData1.dailyStartTime.split(":");
    const endTimeArray = scheduleData1.dailyEndTime.split(":");
    // if (getDateInFormat(date) === scheduleData1.startDate) {
    //   console.log("same day", date.getHours(), ~~startTimeArray[0]);
    //   if (
    //     date.getHours() > ~~startTimeArray[0] ||
    //     (date.getHours() === ~~startTimeArray[0] &&
    //       date.getMinutes() > ~~startTimeArray[1]) ||
    //     (date.getHours() === ~~startTimeArray[0] &&
    //       date.getMinutes() === ~~startTimeArray[1] &&
    //       date.getSeconds() > ~~startTimeArray[2])
    //   ) {
    //     throw Error("Start time has already passed");
    //   }
    // }
    // console.log("end time array", endTimeArray);
    if (
      ~~endTimeArray[0] < ~~startTimeArray[0] ||
      (~~endTimeArray[0] == ~~startTimeArray[0] &&
        ~~endTimeArray[1] <= ~~startTimeArray[1])
    ) {
      throw Error("End time can not be earlier or same than Start time");
    }
  };

  const handleSubmit = () => {
    debugger;

    try {
      checkDateAndTime();

      setFormErrors(validate(formValues));
      scheduleData1.userId = localStorage.getItem("userId");
      scheduleData1.country = localStorage.getItem("userCountry");
      scheduleData1.jobName = campaignName;
      scheduleData1.priority = campaignSchedulePriority;

      console.log(scheduleData1);
      // scheduleData["fileName"] = fileName

      if (Object.keys(errors).length == 0 && !stringInputError) {
        fetch(
          `http://34.214.61.86:5002/bng/ui/create/campschedule?userId=${localStorage.getItem(
            "userId"
          )}`,
          // `http://34.214.61.86:5002/bng/ui/list/campschedule?userId=${localStorage.getItem(
          // "userId"
          // )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(scheduleData1),
          }
        )
          .then((res) => {
            // res.json()
            // .then((res) => {
            if (res.status == 200) {
              debugger;
              localStorage.removeItem("channelName");
              // showSuccess(true);

              console.log(res);
            } else if (res.length == 0) {
            }
            // })
            props.setDisableNext(false);
            props.handleNext()
            // toast("Now you can go to next page");
            setIsDisabled(true);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } catch (e) {
      if (e.message.includes("split")) {
        setErrorMessage("Please select Start and End time");
      } else {
        setErrorMessage(e.message);
      }
    }
  };
  const showFormData = (e) => {
    showForm(true);
  };
  const showListData = (e) => {
    setCancelModal(true);

  };
  const updateFormData = (id) => {
    updateForm(true);
  };
  const deleteFormData = (id) => {};
  const dummyClick = (id) => {
    debugger;
    const elem = document.getElementById(id);
    elem.click();
  };
  const handleConfirm = () => {
    // getcampaignScheduleList();
    // showSuccess(false);
    showForm(false);
    updateForm(false);
    Navigate("/campmngr/home");
  };

  const handleDateSelect = (ranges) => {
    console.log(ranges); // native Date object
  };



  const handleModal = () => {
    setCancelModal(false);
    // if (response === "successful") {
    //   navigate("/campmngr/verifyotp");
    //   // state: { detail: 'true' }
    // } else if (response === "unsuccessful") {
    //   navigate("/campmngr");
    // } else {
    //   navigate("/campmngr/forgotpassword");
    // }
  };
  const handleYesModal = () => {
    window.location.reload(true);
    // if (response === "successful") {
    //   navigate("/campmngr/verifyotp");
    //   // state: { detail: 'true' }
    // } else if (response === "unsuccessful") {
    //   navigate("/campmngr");
    // } else {
    //   navigate("/campmngr/forgotpassword");
    // }
  };

  return (
    <>
      <div className="schedule__campaign">
        <div className="schedule__campaign__container" style={{}}>
          <div style={{ width: "100%", height: "100%" }}>
            {/* {!success ? ( */}
            <div className="col-sm-12 create__flow__component" style={{}}>
              {/* {form || update ? 
                 (  */}
              <div
                className="parent-container create__flow__component__container"
                style={{}}
              >
                <div
                  className="child-container basic__flow__details__container"
                  style={{}}
                >
                  <div
                    className="basic__flow__details__heading__container"
                    style={{}}
                  >
                    <h1>Schedule Campaign</h1>
                  </div>

                  <form
                    className="jobForm"
                    style={{
                      width: "100%",
                      // border: "2px solid red",
                      padding: "1rem 0",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="create__campaign__container left"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        // border: "2px solid blue",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50%",
                        // textAlign: "left",
                      }}
                    >
                      {/* <div className="mb-3 col-4" style={{ display: "flex" }}> */}
                      <div
                        className="campaign__name"
                        style={{ display: "none" }}
                      >
                        <Box
                          component="form"
                          style={{ width: "100%" }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            label="Job Name"
                            value={campaignName}
                            // value={formValues.jobName}
                            // onChange={(e) => setCampaignName(e.target.value)}
                            variant="outlined"
                            type="text"
                            className="form-control"
                            id="jobName"
                            aria-describedby="emailHelp"
                            name="jobName"
                            onChange={(event) => handleChange(event, "jobName")}
                          />
                        </Box>
                      </div>
                      {/* <label>Job Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="jobName"
                            aria-describedby="emailHelp"
                            placeholder={"enter job name"}
                            name="jobName"
                            onChange={(event) => handleChange(event, "jobName")}
                          />
                          <label
                            className={
                              stringInputError
                                ? "showStringErrorJob"
                                : "hideStringErrorJob"
                            }
                          >
                            Enter a valid job name
                          </label>
                          <p>{formErrors.jobName}</p> */}
                      {/* </div> */}

                      <div
                        className="create__campaign__priority__dropdown"
                        style={{ display: "none" }}
                      >
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Select Priority
                          </InputLabel>
                          <Select
                            disabled
                            labelId="demo-simple-select-label"
                            label="Select Channel"
                            value={campaignSchedulePriority}
                            name="priority"
                            id="demo-simple-select priority"
                            className="campaignId form-select"
                            aria-label="Default select example"
                            // onChange={(event) =>
                            //   handleChange(event, "priority")
                            // }
                          >
                            {/* {console.log(channel)} */}

                            <MenuItem id="priority" value={1}>
                              1
                            </MenuItem>
                            <MenuItem id="priority" value={2}>
                              2
                            </MenuItem>
                            <MenuItem id="priority" value={3}>
                              3
                            </MenuItem>
                            <MenuItem id="priority" value="4">
                              4
                            </MenuItem>
                            <MenuItem id="priority" value="5">
                              5
                            </MenuItem>
                            <MenuItem id="priority" value="6">
                              6
                            </MenuItem>
                            <MenuItem id="priority" value="7">
                              7
                            </MenuItem>
                            <MenuItem id="priority" value="8">
                              8
                            </MenuItem>
                            <MenuItem id="priority" value="9">
                              9
                            </MenuItem>
                            <MenuItem id="priority" value="10">
                              10
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      {/* <div className="mb-3 col-4">
                          <label>Priority</label>
                         
                          <select
                            name="priority"
                            id="priority"
                            className="campaignId form-select"
                            aria-label="Default select example"
                            onChange={(event) =>
                              handleChange(event, "priority")
                            }
                          >
                            <option value="select">select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                          <p>{formErrors.priority}</p>
                        </div> */}

                      <div
                        className="create__campaign__workflow__name"
                        style={{ display: "none" }}
                      >
                        <FormControl fullWidth>
                          {/* <InputLabel id="demo-simple-select-label">
                              Capaign Name{" "}
                            </InputLabel> */}
                          <TextField
                            labelId="demo-simple-TextField-label"
                            label="Selected campaign name"
                            value={campaignName}
                            disabled
                            name="campaignId"
                            id="demo-simple-select campaignId"
                            className="campaignId form-select"
                            aria-label="Default select example"
                            // onChange={(event) =>
                            //   handleChange(event, "campaignId")
                            // }
                          >
                            {console.log("rishabh colsole", campaignName)}

                            {/* {campaignListData &&
                                campaignListData.map((e) => (
                                  <MenuItem key={e.campName} value={e.campId}>
                                    {e.campName}

                                  </MenuItem>
                                ))} */}
                          </TextField>
                        </FormControl>

                        {/* <Box
              component="form"
              style={{ width: "100%" }}
              noValidate
              autoComplete="off"
            >
              <label>Work Flow Name</label>
              <select
                id="wfId"
                name="wfId"
                className="campaignId form-select"
                aria-label="Default select example"
                onChange={(event) => handleChange(event, "wfId")}
                value={localStorage.getItem("flowName")}
              >
                {props.FlowListData &&
                  props.FlowListData.map((e) => (
                    <option key={e.id} value={e.wfId}>
                      {e.flowName}
                    </option>
                  ))}
              </select>
            </Box> */}
                      </div>

                      {/* <div className="mb-3 col-4">
                          <label>Capaign Name</label>
                          <select
                            name="campaignId"
                            id="campaignId"
                            className="campaignId form-select"
                            aria-label="Default select example"
                            onChange={(event) =>
                              handleChange(event, "campaignId")
                            }
                          >
                            {campaignListData &&
                              campaignListData.map((e) => (
                                <option key={e.campName} value={e.campId}>
                                  {e.campName}
                                </option>
                              ))}
                          </select>
                          <p>{formErrors.campaignId}</p>
                        </div> */}

                      <div
                        className="create__flow__component__select__channel__dropdown__container"
                        style={{ width: "40%", margin: "1rem" }}
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id="demo-simple-select-label"
                            required
                            // error={showError ? localStore.ivrCampFlowData.flow.channel.length ? false: true:false}
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
                          >
                            {/* {console.log(channel)} */}

                            <MenuItem value={"IVR"}>IVR</MenuItem>
                            <MenuItem value={"SMS"}>SMS</MenuItem>
                            <MenuItem value={"IVR_SMS"}>IVR/SMS</MenuItem>
                            <MenuItem value={"USSD"}>USSD</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      {/* <div className="mb-3 col-4">
                       
                          <label>Channel</label>
                          {localStorage.getItem("channelName") &&
                          (localStorage.getItem("channelName") == "IVR" ||
                            localStorage.getItem("channelName") == "SMS") ? (
                            <select
                              name="Channel"
                              id="Channel"
                              className="channel form-select"
                              aria-label="Default select example"
                              onChange={(event) =>
                                handleChange(event, "Channel")
                              }
                              disabled
                            >
                              <option
                                value={localStorage.getItem("channelName")}
                              >
                                {localStorage.getItem("channelName")}
                              </option>
                            </select>
                          ) : localStorage.getItem("channelName") &&
                            localStorage.getItem("channelName") == "IVR_SMS" ? (
                            <select
                              name="Channel"
                              id="Channel"
                              className="channel form-select"
                              aria-label="Default select example"
                              onChange={(event) =>
                                handleChange(event, "Channel")
                              }
                            >
                              <option value="Select">Select</option>
                              <option value="IVR">ivr</option>
                              <option value="SMS">sms</option>
                            </select>
                          ) : (
                            <select
                              name="Channel"
                              id="Channel"
                              className="channel form-select"
                              aria-label="Default select example"
                              onChange={(event) =>
                                handleChange(event, "Channel")
                              }
                            >
                              <option value="Select">Select</option>
                              <option value="IVR">ivr</option>
                              <option value="SMS">sms</option>
                              <option value="IVR_SMS">ivr/sms</option>
                            </select>
                          )}
                          <p>{formErrors.Channel}</p>
                        </div> */}

                      <div
                        className="create__flow__component__select__channel__dropdown__container"
                        style={{ width: "40%", margin: "1rem" }}
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id="demo-simple-select-label"
                            required
                            // error={showError ? localStore.ivrCampFlowData.flow.channel.length ? false: true:false}
                          >
                            Operator
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            value={localStorage.getItem("operatorName")}
                            label="Select Channel"
                            name="Operator"
                            id="demo-simple-select Operator"
                            className="operator form-select"
                            aria-label="Default select example"
                            onChange={(event) =>
                              handleChange(event, "Operator")
                            }
                            disabled
                          >
                            {/* {console.log(channel)} */}

                            <MenuItem
                              value={localStorage.getItem("operatorName")}
                            >
                              {localStorage.getItem("operatorName")}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      {/* 
                        <div className="mb-3 col-4">
                          <label>Operator</label>
                          <select
                            name="Operator"
                            id="Operator"
                            className="operator form-select"
                            aria-label="Default select example"
                            onChange={(event) =>
                              handleChange(event, "Operator")
                            }
                            disabled
                          >
                            <option value={localStorage.getItem("operatorName")}>{localStorage.getItem("operatorName")}</option>
                          </select>
                          <p>{formErrors.Operator}</p>
                        </div> */}
                      {/* <div className="mb-3 col-4"> */}
                      {/* <label style={{ width: "100%" }}>
                            Day Start Time
                          </label> */}

                      <div
                        className="create__flow__component__select__channel__dropdown__container"
                        style={{ width: "40%", margin: "1rem" }}
                      >
                        <LocalizationProvider
                          style={{ width: "100%" }}
                          dateAdapter={AdapterDateFns}
                        >
                          <Stack style={{ width: "100%", marginTop: "1rem" }}>
                            <TimePicker
                              label="Day Start Time"
                              // value={blackoutStartHour}
                              id="dayStartTime"
                              value={selectedStartDate}
                              name="dayStartTime"
                              onChange={(event) => {
                                setErrorMessage("");
                                handleChange(event, "dayStartTime");
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>
                      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        placeholder="select start time"
                                        mask="__:__ _M"
                                        id="dayStartTime"
                                        value={selectedStartDate}
                                        name='dayStartTime'
                                        onChange={event => handleChange(event, "dayStartTime")}
                                    />
                                </MuiPickersUtilsProvider>
                                <p>{formErrors.dayStartTime}</p> */}
                      {/* </div> */}
                      {/* <div className="mb-3 col-4"> */}
                      {/* <label style={{ width: "100%" }}>Day End Time</label> */}

                      <div
                        className="create__flow__component__select__channel__dropdown__container"
                        style={{ width: "40%", margin: "1rem" }}
                      >
                        <LocalizationProvider
                          style={{ width: "100%" }}
                          dateAdapter={AdapterDateFns}
                        >
                          <Stack style={{ width: "100%", marginTop: "1rem" }}>
                            <TimePicker
                              label="Day End Time"
                              // value={blackoutStartHour}
                              id="dayEndTime"
                              value={selectedEndDate}
                              name="dayEndTime"
                              onChange={(time) => {
                                setErrorMessage("");
                                handleChange(time, "dayEndTime");
                              }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </div>

                      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        placeholder="select end time"
                                        mask="__:__ _M"
                                        id="dayEndTime"
                                        value={selectedEndDate}
                                        name='dayEndTime'
                                        onChange={time => handleChange(time, "dayEndTime")}
                                    />
                                </MuiPickersUtilsProvider>
                                <p>{formErrors.dayEndTime}</p> */}
                      {/* </div> */}
                      <br />
                    </div>

                    <div className="right">
                      <div
                        className="dateRangerPickerOfSchedule"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          justifyContent: "center",
                        }}
                      >
                        {/* <label style={{ marginBottom: "16px" }}>
                            Select Date
                          </label> */}
                        {/* <DateRangePickerComponent id="daterangepicker" /> */}
                        {/* <Calendar
        date={new Date()}
        onChange={(e)=> handleDateSelect(e)}
      /> */}

                        <DateRange
                          style={{}}
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={true}
                          dateDisplayFormat={"MMM d, yyyy"}
                          onChange={(item) => {
                            console.log("rishabh selection", item);
                            setState([item.selection]);
                            scheduleData["endDate"] =
                              getDateInFormat(item.selection.endDate) +
                              "T00:00:00.000Z";
                            scheduleData["startDate"] =
                              getDateInFormat(item.selection.startDate) +
                              "T00:00:00.000Z";

                            setScheduleData((scheduleData1) => {
                              let result = {
                                ...scheduleData1,
                                ...scheduleData,
                              };
                              return result;
                            });
                          }}
                          minDate={todaysDate.startDate}
                          ranges={state}
                        />

                        {/* <p>{formErrors.dateRange}</p> */}
                      </div>
                    </div>
                  </form>
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "1rem",
                      marginTop: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "90%",
                      // border:"2px solid green"
                    }}
                  >
                    <button
                      style={{
                        padding: ".5rem 1rem",
                        border: "none",
                        outline: "none",
                        backgroundColor: " #374151",
                        color: "white",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 2px black",
                        // width:"10%",
                        // margin: "auto",
                        transition: "all 0.5s",
                        fontWeight: "700",
                      }}
                      type="submit"
                      className="btn btn-primary cancelJob submitJob"
                      onClick={(e) => showListData(e)}
                    >
                      Cancel
                    </button>

                    <div
                      className="scheduleCampButtonsContainer"
                      style={{
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div className="mb-3 col-4" style={{ display: "grid" }}>
                        {/* <label>Upload Csv Fileimage.png</label> */}
                        <input
                          type="file"
                          accept=".csv"
                          name="file"
                          hidden
                          className="form-control"
                          id={`uploadCsvFfile`}
                          onChange={(e) => handleChange(e, "uploadCsvFfile")}
                        />
                        <button
                          className="uploadFileButton submitJob"
                          // style={{ height: "45px" }}
                          type="button"
                          component="span"
                          onClick={() => dummyClick(`uploadCsvFfile`)}
                          // onClick={(e) => handleChange(e, "uploadCsvFfile")}
                          style={{
                            padding: ".5rem 1rem",
                            border: "none",
                            outline: "none",
                            backgroundColor: " #374151",
                            color: "white",
                            textTransform: "uppercase",
                            textShadow: "1px 1px 2px black",
                            // width:"10%",
                            // margin: "auto",
                            transition: "all 0.5s",
                            fontWeight: "700",
                          }}
                        >
                          <span style={{ fontSize: "14px" }}>
                            {fileName !== null ? fileName : "Upload File"}
                          </span>
                          {/* <PublishIcon style={{ fontSize: "20px" ,border:"2px solid green" }} className="upicon" /> */}
                        </button>
                        <p>{formErrors.file}</p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary submitJob"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      style={{
                        padding: ".5rem 1rem",
                        border: "none",
                        outline: "none",
                        backgroundColor: " #374151",
                        color: "white",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 2px black",
                        // width:"10%",
                        // margin: "auto",
                        transition: "all 0.5s",
                        fontWeight: "700",
                      }}
                      disabled={isDisabled}
                    >
                      Submit
                    </button>
                  </div>
                  {errorMessage && (
                    <div style={{ color: "Red" }}>{errorMessage}</div>
                  )}
                  {showLoader && <CircularProgress />}
                </div>
              </div>
              {/* )  */}

              {/* :  */}

              {/* (
                  <div className="listContainer">
                    <div style={{ textAlign: "end" }}>
                      <button
                        type="submit"
                        className="btn btn-primary addNew"
                        onClick={(e) => showFormData(e)}
                      >
                        + Add New
                      </button>
                    </div>
                    <div className="card-body text-center p-0">
                      <div className="table-responsive table-striped ctable">
                          <Table
                            className={classes.table}
                            aria-label="simple table"
                          >
                            <TableHead className="thead-light">
                              <TableRow>
                                <TableCell> Id</TableCell>
                                <TableCell align="right">Job Name</TableCell>
                                <TableCell align="right">Priority</TableCell>
                                <TableCell align="right">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tabledata.map((row) => (
                                <TableRow
                                  key={row.service_id}
                                  className="tableRow"
                                >
                                  <TableCell align="right">
                                    {row.jobId}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.jobName}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.priority}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.status}
                                  </TableCell>
                          
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                      </div>
                    </div>
                  </div>
                ) 
                }  */}

              {openCancelModal && (
                <div className="bg-modal" style={{position:"fixed", top:'0', left:"0"}}>
                  <div className="modal-content">
                    <h3 className="title">If you cancel then you have to create campaign again</h3>
                    <h3 className="title">are you sure you want to cancel ? </h3>
                    <div style={{width:"100%", display:"flex", justifyContent:"space-evenly"}}>

                    <button
                      style={{
                        padding: ".5rem 1rem",
                        border: "none",
                        outline: "none",
                        backgroundColor: " #374151",
                        color: "white",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 2px black",
                        width: "10%",
                        // margin: "auto",
                        marginBottom: "1rem",
                        transition: "all 0.5s",
                        fontWeight: "700",
                      }}
                      className="closeBtn"
                      onClick={(e) => handleModal(e)}
                    >
                      No
                    </button>
                    <button
                      style={{
                        padding: ".5rem 1rem",
                        border: "none",
                        outline: "none",
                        backgroundColor: " #374151",
                        color: "white",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 2px black",
                        width: "10%",
                        // margin: "auto",
                        marginBottom: "1rem",
                        transition: "all 0.5s",
                        fontWeight: "700",
                      }}
                      className="closeBtn"
                      onClick={(e) => handleYesModal(e)}
                    >
                      Yes
                    </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* ) : ( */}
            {/* null */}
            {/* // <div className="successCard">
              //   <div className="successIcon">
              //     <i className="checkmark">✓</i>
              //   </div>
              //   <h1>Success</h1>
              //   <button */}
            {/* //     type="submit"
              //     className="btn btn-primary submitJob"
              //     onClick={(e) => handleConfirm(e)}
              //   >
              //     Finish!!
              //   </button>
              // </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleCampaign;

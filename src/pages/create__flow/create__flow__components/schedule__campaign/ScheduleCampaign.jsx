import React from "react";

import "./scheduleCampaign.css";
import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getDateInFormat } from "../../../../services/getDateInFormat";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import Stack from "@mui/material/Stack";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { store } from "../../../../store/store";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../create__campaign/createCampaign.css";
import { CircularProgress } from "@material-ui/core";


let localDate = new Date();

const ScheduleCampaign = (props) => {
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

  const [selectedStartDate, handleStartDateChange] = useState("");
  const [selectedEndDate, handleEndDateChange] = useState("");
  const [fileName, setfileName] = useState(null);
  const [scheduleData1, setScheduleData] = useState({});
  const [stringInputError, handlestringInputError] = useState(false);
  const scheduleData = {};
  const globalState = useContext(store);
  let localStore = globalState.state;

  const {
    campaignName,
    campaignSchedulePriority,
  } = globalState;
  var blackoutDay = [];

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
  }, []);

  const getCampaignDataList = () => {
    const path = `http://34.214.61.86:5002/bng/ui/list/campaign?userId=${localStorage.getItem(
      "userId"
    )}`;
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        console.log("get flowList", data);
        data.unshift({ campName: "select" });
        data.forEach((element) => {
          console.log("rishabh running runnig");
          console.log("===========>", element.campName, campaignName);
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
        blackoutDay = e.target.value;
        console.log(blackoutDay);
      } else if (e.target.id == "uploadCsvFfile") {
        setShowLoader(true);
        let files = e.target.files;
        var formData = new FormData();
        formData.append("file", files[0]);
        fetch(
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
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (catagory == "endBlackoutTime") {
        scheduleData["blackoutEndTime"] =
          e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      }
    }

    console.log(scheduleData);
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
    if (!values.file) {
      errors.file = "csv file is required";
    }
    return errors;
  };

  const checkDateAndTime = () => {
    const date = new Date();
    const startTimeArray = scheduleData1.dailyStartTime.split(":");
    const endTimeArray = scheduleData1.dailyEndTime.split(":");

    if (
      ~~endTimeArray[0] < ~~startTimeArray[0] ||
      (~~endTimeArray[0] === ~~startTimeArray[0] &&
        ~~endTimeArray[1] <= ~~startTimeArray[1])
    ) {
      throw Error("End time can not be earlier or same than Start time");
    }
  };

  const handleSubmit = () => {
    debugger;
    if(scheduleData1.startDate && scheduleData1.endDate){
    try {
      checkDateAndTime();

      setFormErrors(validate(formValues));
      scheduleData1.userId = localStorage.getItem("userId");
      scheduleData1.country = localStorage.getItem("userCountry");
      scheduleData1.jobName = campaignName;
      scheduleData1.priority = campaignSchedulePriority;

      console.log(scheduleData1);

      if (Object.keys(errors).length == 0 && !stringInputError) {
        fetch(
          `http://34.214.61.86:5002/bng/ui/create/campschedule?userId=${localStorage.getItem(
            "userId"
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(scheduleData1),
          }
        )
          .then((res) => {
            if (res.status == 200) {
              localStorage.removeItem("channelName");
              console.log(res);
            } else if (res.length == 0) {
            }
            props.setDisableNext(false);
            props.handleNext()
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
    }}
    else{
      setErrorMessage("Please select dates")
    }
  };

  const showListData = (e) => {
    setCancelModal(true);

  };

  const dummyClick = (id) => {
    debugger;
    const elem = document.getElementById(id);
    elem.click();
  };

  const handleModal = () => {
    setCancelModal(false);
  };
  const handleYesModal = () => {
    window.location.reload(true);
  };

  return (
    <>
      <div className="schedule__campaign">
        <div className="schedule__campaign__container" style={{}}>
          <div style={{ width: "100%", height: "100%" }}>
            <div className="col-sm-12 create__flow__component" style={{}}>
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
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50%",
                      }}
                    >
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
                          >
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
                      <div
                        className="create__campaign__workflow__name"
                        style={{ display: "none" }}
                      >
                        <FormControl fullWidth>
                          <TextField
                            labelId="demo-simple-TextField-label"
                            label="Selected campaign name"
                            value={campaignName}
                            disabled
                            name="campaignId"
                            id="demo-simple-select campaignId"
                            className="campaignId form-select"
                            aria-label="Default select example"
                          >
                          </TextField>
                        </FormControl>
                      </div>
                      <div
                        className="create__flow__component__select__channel__dropdown__container"
                        style={{ width: "40%", margin: "1rem" }}
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id="demo-simple-select-label"
                            required
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
                            <MenuItem value={"IVR"}>IVR</MenuItem>
                            <MenuItem value={"SMS"}>SMS</MenuItem>
                            <MenuItem value={"IVR_SMS"}>IVR/SMS</MenuItem>
                            <MenuItem value={"USSD"}>USSD</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div
                        className="create__flow__component__select__channel__dropdown__container"
                        style={{ width: "40%", margin: "1rem" }}
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id="demo-simple-select-label"
                            required
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
                            <MenuItem
                              value={localStorage.getItem("operatorName")}
                            >
                              {localStorage.getItem("operatorName")}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
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
                          <DateRange
                            style={{}}
                            editableDateInputs={true}
                            moveRangeOnFirstSelection={true}
                            dateDisplayFormat={"MMM d, yyyy"}
                            onChange={(item) => {
                              setErrorMessage('')
                              setState([item.selection]);
                              scheduleData["endDate"] = getDateInFormat(
                                item.selection.endDate
                              )+"T00:00:00.000Z";
                              scheduleData["startDate"] = getDateInFormat(
                                item.selection.startDate
                              )+"T00:00:00.000Z";

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
                          type="button"
                          component="span"
                          onClick={() => dummyClick(`uploadCsvFfile`)}
                          style={{
                            padding: ".5rem 1rem",
                            border: "none",
                            outline: "none",
                            backgroundColor: " #374151",
                            color: "white",
                            textTransform: "uppercase",
                            textShadow: "1px 1px 2px black",
                            transition: "all 0.5s",
                            fontWeight: "700",
                          }}
                        >
                          <span style={{ fontSize: "14px" }}>
                            {fileName !== null ? fileName : "Upload File"}
                          </span>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleCampaign;

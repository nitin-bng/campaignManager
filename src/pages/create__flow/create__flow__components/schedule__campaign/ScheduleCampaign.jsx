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

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { store } from "../../../../store/store";

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
const ScheduleCampaign = () => {
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
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
  const [options] = useState(weekDaya);
  const [selectedDayValue, setSelectedDayValue] = useState([]);
  const initialValues = {
    jobName: "",
    priority: "",
    campaignId: "",
    Channel: "",
    Country: "",
    Operator: "",
    dayStartTime: "",
    dayEndTime: "",
    dateRange: "",
    file: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  var errors;
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
      localStorage.getItem("channelName") &&
      (localStorage.getItem("channelName") == "IVR" ||
        localStorage.getItem("channelName") == "SMS")
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
    fetch("http://34.214.61.86" + ":" + "5000" + "/bng/ui/list/campschedule", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
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
    const path = "http://34.214.61.86:5000/bng/ui/list/campaign";
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        console.log("get flowList", data);
        data.unshift({ campName: "select" });
        setCampaignListData(data);
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
      } else if (e.target.id == "priority") {
        scheduleData["priority"] = e.target.value;
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
      } else if (e.target.id == "campaignId") {
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
        scheduleData["startBlackoutDate"] = e.target.value[0];
        setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
        }));
        scheduleData["endBlackoutDate"] = e.target.value[1];
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
        let files = e.target.files;
        var formData = new FormData();
        formData.append("file", files[0]);
        fetch(
          "http://34.214.61.86" + ":" + "5000" + "/bng/ui/uploadMsisdn",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((res) => {
            res.json().then((res) => {
              if (res) {
                // localStorage.setItem("selctedFile", res.fileName)
                // newFileName = res.fileName
                setfileName(res.fileName);
                scheduleData["fileName"] = res.fileName;
                setScheduleData((scheduleData1) => ({
                  ...scheduleData1,
                  ...scheduleData,
                }));
              } else if (res.length == 0) {
              }
            });
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
  const handleSubmit = () => {
    debugger;
    setFormErrors(validate(formValues));
    scheduleData1.userID = localStorage.getItem("userId");
    console.log(scheduleData1);
    // scheduleData["fileName"] = fileName
    if (Object.keys(errors).length == 0 && !stringInputError) {
      fetch(
        "http://34.214.61.86" + ":" + "5000" + "/bng/ui/create/campschedule",
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
            showSuccess(true);
            console.log(res);
          } else if (res.length == 0) {
          }
          // })
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const showFormData = (e) => {
    showForm(true);
  };
  const showListData = (e) => {
    showForm(false);
    updateForm(false);
  };
  const updateFormData = (id) => {
    updateForm(true);
  };
  const deleteFormData = (id) => {};
  const dummyClick = (id) => {
    const elem = document.getElementById(id);
    elem.click();
  };
  const handleConfirm = () => {
    getcampaignScheduleList();
    showSuccess(false);
    showForm(false);
    updateForm(false);
  };

  return (
    <>
      <div className="schedule__campaign">
        <div className="schedule__campaign__container">
          <div style={{ width: "100%", height: "100%" }}>
            {!success ? (
              <div className="col-sm-12">
                {form || update ? (
                  <div
                    className="parent-container"
                    style={{ background: "#e8edf2" }}
                  >
                    <div className="child-container">
                      <h3 className="mb-4 header-title">
                        Create Campaign Schedule
                      </h3>
                      <form className="jobForm" style={{ textAlign: "left" }}>
                        <div
                          className="row"
                          style={{ height: "100%", textAlign: "left" }}
                        >
                          <div className="mb-3 col-4">
                            <label>Job Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="jobName"
                              aria-describedby="emailHelp"
                              placeholder={"enter job name"}
                              name="jobName"
                              onChange={(event) =>
                                handleChange(event, "jobName")
                              }
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
                            <p>{formErrors.jobName}</p>
                          </div>
                          <div className="mb-3 col-4">
                            <label>Priority</label>
                            {/* <input type="text" className="form-control" id="priority" aria-describedby="emailHelp"
                                    placeholder={'enter priority'}
                                    onChange={event => handleChange(event, "priority")}
                                /> */}
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
                          </div>
                          <div className="mb-3 col-4">
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
                          </div>
                          <div className="mb-3 col-4">
                            {/* <label>Channel</label>
                                <select name="Channel" id="Channel" className="channel form-select" aria-label="Default select example"  onChange={event => handleChange(event, "Channel")} disabled>
                                    <option value={localStorage.getItem("channelName")}>{localStorage.getItem("channelName")}</option>
                                </select>
                                <p>{formErrors.Channel}</p> */}
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
                              localStorage.getItem("channelName") ==
                                "IVR_SMS" ? (
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
                          </div>
                          
                          <div className="mb-3 col-4">
                            <label>Operator</label>
                            <select name="Operator" id="Operator" className="operator form-select" aria-label="Default select example"  onChange={event => handleChange(event, "Operator")} disabled>
                                    <option value="jio">jio</option>
                                </select>
                            <p>{formErrors.Operator}</p>
                          </div>
                          <div className="mb-3 col-4">
                            <label style={{ width: "100%" }}>
                              Day Start Time
                            </label>
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
                          </div>
                          <div className="mb-3 col-4">
                            <label style={{ width: "100%" }}>
                              Day End Time
                            </label>
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
                          </div>
                          <div className="mb-3 col-4">
                            <label style={{ marginBottom: "16px" }}>
                              Select Date
                            </label>
                            {/* <DateRangePickerComponent id="daterangepicker" /> */}

                            {/* <p>{formErrors.dateRange}</p> */}
                          </div>

                          <div
                            className="mb-3 col-4"
                            style={{ display: "grid" }}
                          >
                            <label>Upload Csv File</label>
                            <input
                              type="file"
                              name="file"
                              hidden
                              className="form-control"
                              id={`uploadCsvFfile`}
                              onChange={(e) =>
                                handleChange(e, "uploadCsvFfile")
                              }
                            />
                            <button
                              className="uploadFileButton"
                              style={{ height: "45px" }}
                              type="button"
                              component="span"
                              onClick={() => dummyClick(`uploadCsvFfile`)}
                            >
                              <span style={{ fontSize: "14px" }}>
                                {" "}
                                {fileName !== null ? fileName : "Upload File"}
                              </span>
                              <PublishIcon className="upicon" />
                            </button>
                            <p>{formErrors.file}</p>
                          </div>
                        </div>
                      </form>
                      <div style={{ textAlign: "center" }}>
                        <button
                          type="submit"
                          className="btn btn-primary submitJob"
                          onClick={(e) => handleSubmit(e)}
                        >
                          Submit
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary cancelJob"
                          onClick={(e) => showListData(e)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
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
                        {/* <TableContainer component={Paper}> */}
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
                        {/* </TableContainer> */}
                      </div>
                    </div>
                  </div>
                  // <>fjhgj</>
                )}
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
      </div>
    </>
  );
};

export default ScheduleCampaign;

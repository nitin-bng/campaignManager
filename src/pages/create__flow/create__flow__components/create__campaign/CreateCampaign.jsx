import React, { useState, useContext } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import ListItemText from "@mui/material/ListItemText";
// import Checkbox from "@mui/material/Checkbox";

import "./createCampaign.css";
import { CommonContext } from "../../../../helpers/CommonContext";
import { useEffect } from "react";
import IfIVRSelected from "../create__flow__component/if__ivr__selected/IfIVRSelected";
import RenderingComponentOnLanguageSelect from "../create__flow__component/if__ivr__selected/rendering__component__on__language__select/RenderingComponentOnLanguageSelect";
import CreateFlowComponent from "../create__flow__component/CreateFlowComponent";
import { store } from "../../../../store/store";
import { useError } from "../../../../store/errorContext";
import { ErrorSharp } from "@material-ui/icons";
const priorityArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CreateCampaign = (props) => {
  const globalState = useContext(store);
  var [update, updateForm] = useState(false);
  const { dispatch } = globalState;
  const initialValues = {
    campName: "",
    campPriority: "",
    wfId: "",
    start_date: "",
    campaign_type: "",
    cli_ivr: "",
    cli_sms: "",
  };
  const {
    flowName,
    // setFlowName,

    campaignName,
    setCampaignName,
  } = useContext(CommonContext);

  const [selectPriority, setSelectPriority] = useState("");
  const [createCampCli, setCreateCampCli] = useState();
  const [scheduleData1, setScheduleData] = useState({});
  const [flowData, setFlowData] = useState({});
  var [channelName, getChannelName] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);
  const {showError, setShowError,errorState, errorDispatch} = useError()

  var flowId = "";

  var scheduleData = {};
  var flowDataFromApi = {};
  const handlePriorityChange = (event) => {
    setSelectPriority(event.target.value);
  };

  const saveValues = (e) => {
    setCreateCampCli(e.target.value);
  };

  useEffect(() => {
    debugger;
    // setData([]);
    // props.getFlowList();
  }, []);



  useEffect(()=>{
    setShowError(false)
    errorDispatch({type: 'CREATE_CAMPAIGN', payload: false})
  },[])
  
  useEffect(()=>{
    if(formValues.campName && formValues.campPriority && formValues.wfId && formValues.campaign_type && formValues.cli_ivr){
      errorDispatch({type: 'CREATE_CAMPAIGN', payload: true})
    }
    else{
      errorDispatch({type: 'CREATE_CAMPAIGN', payload: false})
      
    }
  },[formValues.campName, formValues.campPriority , formValues.wfId , formValues.campaign_type , formValues.cli_ivr])


  const getFlow = async (id) => {
    debugger;
    localStorage.setItem("wfId", id);
    flowId = id;
    const path = "http://34.214.61.86:5000/bng/ui/get/flow?wfId=" + id;
    return await fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        setFlowData(data);
        getChannelName(data.flow.channel);
        // if(data.flow.channel != "IVR_SMS"){
        localStorage.setItem("channelName", data.flow.channel);
        // }
        localStorage.setItem("flowName", data.service_Data.name);
        // history.push({
        //     pathname: '/campaign/ivr',
        //     state: { detail: data }
        // });
        console.log("dataFrom api call ", data);
        flowDataFromApi = data.flow;

        console.log("flowDataFromApi", flowDataFromApi);
        flowFromApi(data.flow);
        return data;
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  };

  const handleChange = (e, catagory) => {
    debugger;
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: !isNaN(value)? value >=0 ? value : 0:value });
    if (e.target.id == "campName") {
      // validateData('campName', e);
      scheduleData["campName"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.name == "campPriority") {
      scheduleData["campPriority"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.name == "wfId") {
      scheduleData["wfId"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
      getFlow(e.target.value);
    } else if (e.target.id == "serviceName") {
      scheduleData["serviceName"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "cli_ivr") {
      // validateData('cli_ivr', e);
      scheduleData["cli_ivr"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "cli_sms") {
      // validateData('cli_sms', e);
      scheduleData["cli_sms"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "incoming" || e.target.id == "outgoing") {
      scheduleData["campaign_type"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "start_date") {
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
      console.log(scheduleData1);
    }
  };

  const handleSubmit = (e) => {
    if(formValues.campName && formValues.campPriority && formValues.wfId && formValues.campaign_type && formValues.cli_ivr){
      setShowError(false)
    e.preventDefault();
    console.log(scheduleData1);

    if (update) {

      fetch("http://34.214.61.86" + ":" + "5000" + "/bng/ui/update/campaign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...scheduleData1, userId: localStorage.getItem("userId")}),
      })
        .then((res) => {
          res.json().then((res) => {
            if (res) {
              // showSuccess(true);
              console.log(res);
            } else if (res.length == 0) {
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      fetch("http://34.214.61.86" + ":" + "5000" + "/bng/ui/create/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...scheduleData1,  userId: localStorage.getItem("userId")}),
      })
        .then((res) => {
          res.json().then((res) => {
            if (res) {
              localStorage.setItem("campId", res.campId);
              // history.push({
              //   pathname: "/Campaigns/createFlow",
              //   state: { detail: flowData },
              // });
              // showSuccess(true)
              console.log(res);
            } else if (res.length == 0) {
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }}else{
      setShowError(true)
    }
  };

  const flowFromApi = (data) => {
    debugger;
    let localStore = globalState.state;
    console.log("local store ... ", localStore);
    localStore.ivrCampFlowData.flow = data;
    dispatch({ type: "SET_DATA", nState: localStore });
    console.log(globalState);
  };

  // useEffect(()=>{
  //   flowFromApi()
  // },[])

  return (
    <>
      <div className="create__campaign" style={{boxShadow:"2px 2px 2px grey",}}>
        <div
          className="create__campaign__container"
          style={{ height: "30vh" }}
        >
          <div className="campaign__name">
            <Box
              component="form"
              style={{ width: "100%" }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="campName"
                name="campName"
                label="Campaign Name"
                // value={campaignName}
                value={formValues.campName}
                // onChange={(e) => setCampaignName(e.target.value)}
                onChange={(event) => handleChange(event, "jobName")}
                variant="outlined"
                required
                error={showError ? formValues.campName ? false : true :false}
                />
            </Box>
          </div>

          <div className="create__campaign__priority__dropdown">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label"
                required
                error={showError ? formValues.campPriority ? false : true :false}>
                Select Priority
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select campPriority"
                label="Select Channel"
                className="campaignId form-select"
                aria-label="Default select example"
                name="campPriority"
                value={formValues.campPriority}
                onChange={(event) => handleChange(event, "priority")}
                required
                error={showError ? formValues.campPriority ? false : true :false}
              >
                {/* {console.log(channel)} */}

                <MenuItem id="campPriority" value="select">
                  select
                </MenuItem>
                <MenuItem id="campPriority" value={1}>
                  1
                </MenuItem>
                <MenuItem id="campPriority" value={2}>
                  2
                </MenuItem>
                <MenuItem id="campPriority" value={3}>
                  3
                </MenuItem>
                <MenuItem id="campPriority" value="4">
                  4
                </MenuItem>
                <MenuItem id="campPriority" value="5">
                  5
                </MenuItem>
                <MenuItem id="campPriority" value="6">
                  6
                </MenuItem>
                <MenuItem id="campPriority" value="7">
                  7
                </MenuItem>
                <MenuItem id="campPriority" value="8">
                  8
                </MenuItem>
                <MenuItem id="campPriority" value="9">
                  9
                </MenuItem>
                <MenuItem id="campPriority" value="10">
                  10
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="create__campaign__workflow__name">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label"
              required
              error={showError ? formValues.wfId ? false : true :false}
              >
                Work flow name{" "}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select wfId"
                label="Select Channel"
                className="campaignId form-select"
                aria-label="Default select example"
                name="wfId"
                value={formValues.wfId}
                onChange={(event) => handleChange(event, "wfId")}
                required
                error={showError ? formValues.wfId ? false : true :false}
              >
                {props.FlowListData &&
                  props.FlowListData.map((e) => (
              
                    <MenuItem key={e.id} value={e.wfId}>
                      {e.flowName}
                    </MenuItem>
                  ))}
              </Select>
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
          <div
            className="create__campaign__campaign__type__radio__button"
            style={{
              // border: "2px solid blue",
              height: "50px",
            }}
          >
            <FormControl
              style={{
                border: "1px solid grey",
                borderRadius: "5px",
                display: "flex",
                height: "100%",
                position: "relative",
              }}
              
            >
              <FormLabel
                id="demo-row-radio-buttons-group-label"
                style={{
                  position: "absolute",
                  top: "-13px",
                  left: "7px",
                  padding: "0 4px",
                  backgroundColor: "white",
                  fontSize: "15px",
                }}
                required
                error={showError ? formValues.campaign_type ? false : true :false}
              >
                Campaign Type
              </FormLabel>
              <RadioGroup row>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "6px",
                  padding: "5px",
                  boxSizing: "border-box",
                  // border: "2px solid green",
                }}
              >
                <div
                  style={{
                    // border: "2px solid red",
                    display: "flex",
                    width: "40%",
                  }}
                >
                  <label htmlFor="incoming" className="campaignInputCheckbox">Incoming</label>
                  <input
                    type="radio"
                    id="incoming"
                    name="campaign_type"
                    value="incoming"
                    onChange={(e) => handleChange(e, "incoming")}
                    style={{
                      marginLeft: "10px",
                      // border: "2px solid red",
                    }}
                  />
                </div>
                <div
                  style={{
                    // border: "2px solid red",
                    display: "flex",
                    width: "40%",
                  }}
                >
                  <label htmlFor="outgoing" className="campaignInputCheckbox">Outgoing</label>
                  <input
                    type="radio"
                    id="outgoing"
                    name="campaign_type"
                    value="outgoing"
                    onChange={(e) => handleChange(e, "outgoing")}
                    style={{
                      marginLeft: "10px",
                    }}
                  />
                </div>
              </div> */}
              <FormControlLabel name="campaign_type" value="incoming" control={<Radio />} label="Incoming" onChange={(e) => handleChange(e, "incoming")} 
              />
              <FormControlLabel name="campaign_type" value="outgoing" control={<Radio />} label="Outgoing" onChange={(e) => handleChange(e, "outgoing")} />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="cli__container">
            <Box
              component="form"
              style={{ width: "100%" }}
              noValidate
              autoComplete="off"
            >
              <TextField
                type="number"
                label={"cli"}
                variant="outlined"
                className="form-control"
                id="cli_ivr"
                aria-describedby="emailHelp"
                placeholder={"enter cli for ivr"}
                name="cli_ivr"
                value={formValues.cli_ivr}
                onChange={(event) => handleChange(event, "cli_ivr")}
                required
                error={showError ? formValues.cli_ivr ? false : true :false}
              />
            </Box>
          </div>
        </div>
          <div style={{ paddingBottom: "2rem" }}>
            <CreateFlowComponent disableEditingWhileCreatingCamp={true} />
          </div>
      </div>
    </>
  );
};

export default CreateCampaign;

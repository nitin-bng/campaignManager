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
import "./createCampaign.css";
import { CommonContext } from "../../../../helpers/CommonContext";
import { useEffect } from "react";
import CreateFlowComponent from "../create__flow__component/CreateFlowComponent";
import { store } from "../../../../store/store";
import { useError } from "../../../../store/errorContext";
import "./createCampaign.css";
import { toast } from "react-toastify";
import { useMemo } from "react";
import config from "../../../../ApiConfig/Config";

const CreateCampaign = (props) => {
  const globalState = useContext(store);
  const {userFeatures}  =globalState
  const localStore = globalState.state.ivrCampFlowData;
  const [isDisabled, setIsDisabled] = useState(false)
  const {
    dispatch,
    setCampaignName,
    campaignName,
    campaignSchedulePriority,
    setCampaignSchedulePriority,
  } = globalState;
  const initialValues = {
    campPriority: { campaignSchedulePriority },
    wfId: "",
    start_date: "",
    campaign_type: "",
    cli_ivr: "",
    cli_sms: "",
    cli_ussd: "",
  };

  const [scheduleData1, setScheduleData] = useState({});
  const [formValues, setFormValues] = useState(initialValues);
  const { showError, setShowError, errorState, errorDispatch } = useError();
  const [showFlowState, setShowFlowState] = useState(false);
  const [update, updateForm] = useState(false);

  var scheduleData = {};

  const localWfId = localStorage.getItem('wfId')
  const value = useMemo(()=>props.FlowListData.filter(item=>item.wfId === localWfId)[0],[props.FlowListData, localWfId])

  useEffect(()=>{
    if(value){
      setFormValues({
      ...formValues,
      "wfId": !isNaN(value.wfId) ? (value.wfId >= 0 ? value.wfId : 0) : value.wfId,
    });
    scheduleData["wfId"] = value.wfId;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }))
    }
  },[value])

  useEffect(() => {
    debugger;
    props.setDisableNext(true);
    setCampaignName('')
    setCampaignSchedulePriority()
  }, []);

  useEffect(() => {
    setShowError(false);
    errorDispatch({ type: "CREATE_CAMPAIGN", payload: false });
    const value = (userFeatures[localStorage.getItem("channelName")].Incoming && userFeatures[localStorage.getItem("channelName")].Outgoing) ? formValues.campaign_type :userFeatures[localStorage.getItem("channelName")].Incoming ? 'incoming' : 'outgoing'
    setFormValues(prev=>{return {...prev,campaign_type: value}})
  }, []);

  useEffect(() => {
    if (
      campaignName &&
      campaignSchedulePriority &&
      formValues.wfId &&
      formValues.campaign_type &&
      formValues["cli_" + localStore.flow.channel?.toLowerCase()]
    ) {
      errorDispatch({ type: "CREATE_CAMPAIGN", payload: true });
    } else {
      errorDispatch({ type: "CREATE_CAMPAIGN", payload: false });
    }
  }, [
    campaignName,
    campaignSchedulePriority,
    formValues.wfId,
    formValues.campaign_type,
    formValues["cli_" + localStore.flow.channel?.toLowerCase()],
  ]);

  const getFlow = async (id) => {
    debugger;
    localStorage.setItem("wfId", id);
    // const path = config.server.path+config.server.port2+"/bng/ui/get/flow?wfId=" + id;
    return await fetch(config.server.path+config.server.port2+"/bng/ui/get/flow?wfId=" + id)
      .then((response) => response.json())
      .then(function (data) {
        localStorage.setItem("channelName", data.flow.channel); 
        localStorage.setItem("flowName", data.service_Data.name);  
        flowFromApi(data.flow);
        return data;
      })
      .catch(function (error) {
        return error;
      });
  };

  const handleChange = (e) => {
    debugger;
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: !isNaN(value) ? (value >= 0 ? value : 0) : value,
    });
    if (e.target.id == "campName") {
      
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
      
      scheduleData["cli_ivr"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "cli_sms") {
      
      scheduleData["cli_sms"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "cli_ussd") {
      
      scheduleData["cli_ussd"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.value == "incoming" || e.target.value == "outgoing") {
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
    }
  };

  const handleSubmit = (e) => {
    scheduleData1["campaign_type"] = formValues.campaign_type ? formValues.campaign_type : userFeatures[localStorage.getItem("channelName")].Incoming ? 'incoming' : 'outgoing'
    if (
      campaignName &&
      campaignSchedulePriority &&
      formValues.wfId &&
      formValues.campaign_type &&
      formValues["cli_" + localStore.flow.channel?.toLowerCase()]
    ) {
      setShowError(false);
      e.preventDefault();
      e.preventDefault();
      if (update) {
        fetch(
          config.server.path+config.server.port2 + "/bng/ui/update/campaign",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...scheduleData1,
              userId: localStorage.getItem("userId"),
              campName: campaignName,
              campPriority: campaignSchedulePriority,
            }),
          }
        )
          .then((res) => {
            res.json().then((res) => {
              if (res) {
                // showSuccess(true);
              } else if (res.length == 0) {
              }
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        fetch(
          config.server.path+config.server.port2 + "/bng/ui/create/campaign",

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...scheduleData1,
              userId: localStorage.getItem("userId"),
              campName: campaignName,
              campPriority: campaignSchedulePriority,
            }),
          }
        )
          .then((res) => {
            res.json().then((res) => {
              if (res.status === 'successful') {
                localStorage.setItem("campId", res.campId);
                // history.push({
                //   pathname: "/Campaigns/createFlow",
                //   state: { detail: flowData },
                // });
                // showSuccess(true)
                setShowFlowState(true);
                props.setDisableNext(false);
                setIsDisabled(true)
              } else if (res.status === 'unsuccessful') {
                toast(res.reason)
              }
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
      
    } else {
      setShowError(true);
    }
  };

  const flowFromApi = (data) => {
    debugger;
    let localStore = globalState.state;
    localStore.ivrCampFlowData.flow = data;
    dispatch({ type: "SET_DATA", nState: localStore });
  };

  return (
    <>
      <div
        className="create__campaign"
        style={{ boxShadow: "2px 2px 2px grey" }}
      >
        <div className="basic__flow__details__heading__container">
          <h1>Create Campaign</h1>
        </div>
        <div className="create__campaign__container" style={{ height: "30vh" }}>
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
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                variant="outlined"
                required
                error={showError ? (campaignName ? false : true) : false}
              />
            </Box>
          </div>

          <div className="create__campaign__priority__dropdown">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                required
                error={
                  showError ? (campaignSchedulePriority ? false : true) : false
                }
              >
                Select Priority
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select campPriority"
                label="Select Channel"
                className="campaignId form-select"
                aria-label="Default select example"
                name="campPriority"
                value={campaignSchedulePriority}
                onChange={(event) =>
                  setCampaignSchedulePriority(event.target.value)
                }
                required
                error={
                  showError ? (campaignSchedulePriority ? false : true) : false
                }
              >
                <MenuItem id="campPriority" value={1}>
                  1 (Least)
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
                  5 (Medium)
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
                  10 (High)
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="create__campaign__workflow__name">
            <FormControl fullWidth>
              <Box
                id="demo-simple-select-label"
                required
                error={showError ? (formValues.wfId ? false : true) : false}
              >
              </Box>
              <TextField
                labelId="demo-simple-select-label"
                id="demo-simple-select wfId"
                label="Workflow Name"
                className="campaignId form-select"
                aria-label="Default select example"
                name="wfId"
                value={value?.flowName ? value.flowName : ''}
                disabled={true}
              >
              </TextField>
            </FormControl>
          </div>
                      <div
              className="create__campaign__campaign__type__radio__button"
              style={{  
                height: "50px",
              }}
            >
              <FormControl
              disabled={!(userFeatures[localStorage.getItem("channelName")].Incoming && userFeatures[localStorage.getItem("channelName")].Outgoing)}
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
                  error={
                    showError
                      ? formValues.campaign_type
                        ? false
                        : true
                      : false
                  }
                >
                  Campaign Type
                </FormLabel>
                <RadioGroup row value={(userFeatures[localStorage.getItem("channelName")].Incoming && userFeatures[localStorage.getItem("channelName")].Outgoing) ? formValues.campaign_type :userFeatures[localStorage.getItem("channelName")].Incoming ? 'incoming' : 'outgoing'}>
                  <FormControlLabel
                    name="campaign_type"
                    value="incoming"
                    control={<Radio />}
                    label="Incoming"
                    onChange={(e) => handleChange(e)}
                    style={{ marginLeft: "5px" }}
                  />
                  <FormControlLabel
                    name="campaign_type"
                    value="outgoing"
                    control={<Radio />}
                    label="Outgoing"
                    onChange={(e) => handleChange(e)}
                  />
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
                type="input"
                label={"Cli"}
                variant="outlined"
                className="form-control"
                id={"cli_" + localStore.flow.channel?.toLowerCase()}
                aria-describedby="emailHelp"
                placeholder={"Enter Cli"}
                name={"cli_" + localStore.flow.channel?.toLowerCase()}
                value={
                  formValues["cli_" + localStore.flow.channel?.toLowerCase()]
                }
                onChange={(event) =>
                  handleChange(
                    event,
                    "cli_" + localStore.flow.channel?.toLowerCase()
                  )
                }
                onWheel={(e) => e.target.blur()}
                required
                error={
                  showError
                    ? formValues["cli_" + localStore.flow.channel?.toLowerCase()]
                      ? false
                      : true
                    : false
                }
              />
            </Box>
          </div>
        </div>
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
            margin: "auto",
            marginBottom: "1rem",
            transition: "all 0.5s",
            fontWeight: "700",
          }}
          onClick={(e) => {
            handleSubmit(e);
          }}
          className="submitJob"
          disabled={isDisabled}
        >
          Submit
        </button>
        {showFlowState ? (
          <div style={{ paddingBottom: "2rem" }}>
            <CreateFlowComponent disableEditingWhileCreatingCamp={true} bargein={props.bargein} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CreateCampaign;

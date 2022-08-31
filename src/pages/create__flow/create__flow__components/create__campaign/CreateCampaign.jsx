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
    setFormValues({ ...formValues, [name]: value });
    if (e.target.id == "campName") {
      // validateData('campName', e);
      scheduleData["campName"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "campPriority") {
      scheduleData["campPriority"] = e.target.value;
      setScheduleData((scheduleData1) => ({
        ...scheduleData1,
        ...scheduleData,
      }));
    } else if (e.target.id == "wfId") {
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
    debugger;
    e.preventDefault();
    console.log(scheduleData1);

    if (update) {
      fetch("http://34.214.61.86" + ":" + "5000" +"/bng/ui/update/campaign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData1),
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
        body: JSON.stringify(scheduleData1),
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
      <div className="create__campaign">
        <div className="create__campaign__container">
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
              />
            </Box>
          </div>

          <div className="create__campaign__priority__dropdown">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Priority
              </InputLabel>
              {/* <Select
                name="campPriority"
                id="campPriority"
                className="campaignId form-select"
                aria-label="Default select example"
                // value={selectPriority}
                value={formValues.campPriority}
                label="Select channel"
                // onChange={(event) => {
                //   handleChange(event, "priority");
                //   handlePriorityChange(event);
                // }}
                onChange={(event) => handleChange(event, "priority")}
              > */}
              {/* <Select
                                                // name="campaignId"
                                                id="campPriority"
                                                className="campaignId form-select"
                                                aria-label="Default select example"
                                                name="campPriority"
                                                value={formValues.campPriority}
                                                onChange={(event) =>
                                                    handleChange(
                                                        event,
                                                        'priority'
                                                    )
                                                }
                                            >
                {priorityArray.map((element, index) => {
                  return <MenuItem value={element}>{element}</MenuItem>;
                })}
              </Select> */}
              <select
                // name="campaignId"
                id="campPriority"
                className="campaignId form-select"
                aria-label="Default select example"
                name="campPriority"
                value={formValues.campPriority}
                onChange={(event) => handleChange(event, "priority")}
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
            </FormControl>
          </div>

          <div className="create__campaign__workflow__name">
            <Box
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
                // value={localStorage.getItem("flowName")}
              >
                {props.FlowListData &&
                  props.FlowListData.map((e) => (
                    <option key={e.id} value={e.wfId}>
                      {e.flowName}
                    </option>
                  ))}
              </select>
            </Box>
          </div>

          <div className="create__campaign__campaign__type__radio__button">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Campaign Type
              </FormLabel>
              <div
                style={{
                  display: "flex",
                  marginTop: "6px",
                }}
              >
                <div>
                  <span className="campaignInputCheckbox">Incoming</span>
                  <input
                    type="radio"
                    id="incoming"
                    name="campaign_type"
                    value="incoming"
                    onChange={(e) => handleChange(e, "incoming")}
                    style={{
                      marginLeft: "20px",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginLeft: "20px",
                  }}
                >
                  <span className="campaignInputCheckbox">Outgoing</span>
                  <input
                    type="radio"
                    id="outgoing"
                    name="campaign_type"
                    value="outgoing"
                    onChange={(e) => handleChange(e, "outgoing")}
                    style={{
                      marginLeft: "20px",
                    }}
                  />
                </div>
              </div>
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
                id="if__IVR__selected"
                type="number"
                label={"cli"}
                variant="outlined"
                value={createCampCli}
                onChange={saveValues}
              />
            </Box>
          </div>
          <button
            type="submit"
            className="btn btn-primary submitJob"
            onClick={(e) => handleSubmit(e)}
          >
            {update ? "update" : "Submit"}
          </button>
        </div>
        <div style={{ border: "2px solid red", paddingBottom: "2rem" }}>
          <CreateFlowComponent />
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;

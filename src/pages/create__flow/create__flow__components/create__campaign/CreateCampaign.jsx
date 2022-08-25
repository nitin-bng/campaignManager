import React, { useState, useContext } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
// import OutlinedInput from "@mui/material/OutlinedInput";
// import ListItemText from "@mui/material/ListItemText";
// import Checkbox from "@mui/material/Checkbox";

import './createCampaign.css'
import { CommonContext } from "../../../../helpers/CommonContext";
import { useEffect } from "react";



const priorityArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CreateCampaign = () => {
  const [FlowListData, setFlowListData] = useState([]);
  const initialValues = {
    campName: '',
    campPriority: '',
    wfId: '',
    start_date: '',
    campaign_type: '',
    cli_ivr: '',
    cli_sms: '',
};
  const {
    flowName,
    // setFlowName,

    campaignName,
    setCampaignName,
  } = useContext(CommonContext);

  const [selectPriority, setSelectPriority] = useState("");
  const [createCampCli, setCreateCampCli] = useState()
  const [scheduleData1, setScheduleData] = useState({});
  const [flowData, setFlowData] = useState({});
  var [channelName, getChannelName] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);

  var flowId = '';


  var scheduleData = {};

  const handlePriorityChange = (event) => {
    setSelectPriority(event.target.value);
  };

  const saveValues = (e) => {
    setCreateCampCli(e.target.value);
  };

useEffect(()=>{
  getFlowList()
}, [])

  const getFlowList =  () => {
    debugger
    const path = 'http://34.214.61.86:5000/bng/ui/list/flows'
     fetch(path)
        .then(response => response.json())
        .then(function (data) {
            debugger;
            console.log("get flowList", data);
            data.unshift({flowName: "select", id:'select', wfId:'select'});
            setFlowListData(data);
            return data;

        }).catch(function (error) {
            console.log("failed", error);
            return error;
        })
}
const getFlow = async (id) => {
  debugger;
  localStorage.setItem('wfId', id);
  flowId = id;
  const path = 'http://34.214.61.86:5000/bng/ui/get/flow?wfId=' + id;
  return await fetch(path)
      .then((response) => response.json())
      .then(function (data) {
          setFlowData(data);
          getChannelName(data.flow.channel);
          // if(data.flow.channel != "IVR_SMS"){
          localStorage.setItem('channelName', data.flow.channel);
          // }
          localStorage.setItem('flowName', data.service_Data.name);
          // history.push({
          //     pathname: '/campaign/ivr',
          //     state: { detail: data }
          // });
          return data;
      })
      .catch(function (error) {
          console.log('failed', error);
          return error;
      });
};

const handleChange = (e, catagory) => {
  debugger;
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
  if (e.target.id == 'campName') {
      // validateData('campName', e);
      scheduleData['campName'] = e.target.value;
      setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
      }));
  } else if (e.target.id == 'campPriority') {
      scheduleData['campPriority'] = e.target.value;
      setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
      }));
  } else if (e.target.id == 'wfId') {
      scheduleData['wfId'] = e.target.value;
      setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
      }));
      getFlow(e.target.value);
  } else if (e.target.id == 'serviceName') {
      scheduleData['serviceName'] = e.target.value;
      setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
      }));
  } else if (e.target.id == 'cli_ivr') {
      // validateData('cli_ivr', e);
      scheduleData['cli_ivr'] = e.target.value;
      setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
      }));
  } else if (e.target.id == 'cli_sms') {
      // validateData('cli_sms', e);
      scheduleData['cli_sms'] = e.target.value;
      setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
      }));
  } else if (e.target.id == 'incoming' || e.target.id == 'outgoing') {
      scheduleData['campaign_type'] = e.target.value;
      setScheduleData((scheduleData1) => ({
          ...scheduleData1,
          ...scheduleData,
      }));
  } else if (e.target.id == 'start_date') {
      if (e.target.value != null) {
          scheduleData['startDate'] = e.target.value[0];
          setScheduleData((scheduleData1) => ({
              ...scheduleData1,
              ...scheduleData,
          }));
          scheduleData['endDate'] = e.target.value[1];
          setScheduleData((scheduleData1) => ({
              ...scheduleData1,
              ...scheduleData,
          }));
      } else if (e.target.value == null) {
          scheduleData['startDate'] = '';
          setScheduleData((scheduleData1) => ({
              ...scheduleData1,
              ...scheduleData,
          }));
          scheduleData['endDate'] = '';
          setScheduleData((scheduleData1) => ({
              ...scheduleData1,
              ...scheduleData,
          }));
      }
      console.log(scheduleData1);
  }
};



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
                id="create__flow__component__flow__name"
                label="Campaign Name"    
                value={campaignName}
                onChange={e=>setCampaignName(e.target.value)}            
                variant="outlined"
              />
            </Box>
          </div>

          <div className="create__campaign__priority__dropdown">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Priority
              </InputLabel>
              <Select
                name="campaignId"
                id="campPriority"
                className="campaignId form-select"
                aria-label="Default select example"
                value={selectPriority}
                label="Select channel"
                onChange={(event) =>{
                  handleChange(
                      event,
                      'priority'
                  )
                  handlePriorityChange(event)}
                }
              >
                {priorityArray.map((element, index) => {
                  return <MenuItem value={element}>{element}</MenuItem>;
                })}
              </Select>
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
                                                onChange={(event) =>
                                                    handleChange(event, 'wfId')
                                                }
                                            >
                                                {FlowListData &&
                                                    FlowListData.map((e) => (
                                                        <option
                                                            key={e.id}
                                                            value={e.wfId}
                                                        >
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
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="incomming"
                  control={<Radio />}
                  label="Incomming"
                />
                <FormControlLabel
                  value="outgoing"
                  control={<Radio />}
                  label="Outgoing"
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
                id="if__IVR__selected"
                type="number"
                label={"cli"}
                variant="outlined"
                value={createCampCli}
                onChange={saveValues}
              />
            </Box>
          </div>


        </div>
      </div>
    </>
  );
};

export default CreateCampaign;

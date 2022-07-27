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



const priorityArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CreateCampaign = () => {

  const {
    flowName,
    // setFlowName,

    campaignName,
    setCampaignName,
  } = useContext(CommonContext);

  const [selectPriority, setSelectPriority] = useState("");
  const [createCampCli, setCreateCampCli] = useState()

  const handleChange = (event) => {
    setSelectPriority(event.target.value);
  };

  const saveValues = (e) => {
    setCreateCampCli(e.target.value);
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
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectPriority}
                label="Select channel"
                onChange={handleChange}
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
              <TextField
                id="create__flow__component__flow__name"
                label="Work Flow Name"
                value={flowName}
                disabled
                variant="outlined"
              />
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

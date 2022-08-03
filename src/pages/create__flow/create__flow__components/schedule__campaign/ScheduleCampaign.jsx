import React, { useState, useContext } from "react";

import "./scheduleCampaign.css";

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
import { CommonContext } from "../../../../helpers/CommonContext";

const ScheduleCampaign = () => {
  const { channel, setChannel, campaignName, setCampaignName } =
    useContext(CommonContext);

  const [selectPriority, setSelectPriority] = useState("");
  const [createCampCli, setCreateCampCli] = useState();

  const handleChange = (event) => {
    setSelectPriority(event.target.value);
  };

  const saveValues = (e) => {
    setCreateCampCli(e.target.value);
  };



  return (
    <>
      <div className="schedule__campaign">
        <div className="schedule__campaign__container">
          <div className="schedule__campaign__channel__selected campaign__name">
            <Box
              component="form"
              style={{ width: "100%" }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="create__flow__component__flow__name"
                value={channel}
                label="Channel"
                variant="outlined"
                disabled
              />
            </Box>
          </div>

          <div className="schedule__campaign__operator__selected campaign__name">
            <Box
              component="form"
              style={{ width: "100%" }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="create__flow__component__flow__name"
                // value={null}
                label="Operator"
                variant="outlined"
                disabled
              />
            </Box>
          </div>

          <div className="schedule__campaign__campaign__name create__campaign__workflow__name">
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
                disabled
                variant="outlined"
              />
            </Box>
          </div>

          <div className="date__range__picker">
                      </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleCampaign;

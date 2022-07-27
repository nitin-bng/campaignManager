import React from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import HelpIcon from "@mui/icons-material/Help";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import MenuAppBar from "../../components/topbar/MenuAppBar";

import "./userconfig.css";
import { blackout__days } from "../../helpers/All__mapping";

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
Blackout day
Blackout day means those days on which you don't want to run any campaignn
We can select multiple days
If you select all days your campian will not work
`;
const TotalChannelInfo = `
Total number of channels required
Total number of channels means
we can give only numeric values
Numeric values shouls be greater than 1 and lesser that 5
`;

const TotalNumerOfTPSRequiredInfo = `
Total number of TPS required
Total number of channels means
we can give only numeric values
Numeric values shouls be greater than 1 and lesser that 5
`;

const BlackoutStartHourInfo = `
Blackout start Hour
Blackout start hour mean the starting time for a particular day for which you don't want to run any campaignn
`;

const BlackoutEndHourInfo = `
Blackout end Hour
Blackout end hour mean the ending time for a particular day for which you want to resume any campaignn
`;

const BlackoutDateInfo = `
Blackout date
Blackout date means those dates on which you don't want to run any campian
You should not select previous dates

`;

const UserConfig = () => {
  const [blackOutDays, setBlackOutDays] = React.useState([]);
  const [blackoutStartHour, setBlackoutStartHour] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [blackoutEndHour, setBlackoutEndHour] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const [blackoutDate, setBlackoutDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setBlackOutDays(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleblackoutHourChange = (newblackoutHour) => {
    setBlackoutStartHour(newblackoutHour);
    setBlackoutEndHour(newblackoutHour);
  };

  const handleblackoutDateChange = (newblackoutDate) => {
    setBlackoutDate(newblackoutDate);
  };

  const userConfigSubmit = () => {
    console.log("userconfigsubmit");
    localStorage.setItem("createFlowInMenuBarDisbled", true);
  };

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
              <div className="userconfig__maincontent__form__container">
                <div className="userconfig__maincontent__form">
                  <div className="userconfig__maincontent__form__inside__containers userconfig__blackoutday__dropdown__container">
                    <FormControl style={{ width: "80%" }}>
                      <InputLabel
                        style={{
                          backgroundColor: "white",
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
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {blackout__days.map((blackout__days) => (
                          <MenuItem key={blackout__days} value={blackout__days}>
                            <Checkbox
                              checked={
                                blackOutDays.indexOf(blackout__days) > -1
                              }
                            />
                            <ListItemText primary={blackout__days} />
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
                        label="Number of channels required"
                        variant="outlined"
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
                        label="Number of tps required"
                        variant="outlined"
                      />
                    </Box>
                    <CustomWidthTooltip title={TotalNumerOfTPSRequiredInfo}>
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack style={{ width: "80%" }} spacing={3}>
                        <TimePicker
                          label="Blackout start hour"
                          value={blackoutStartHour}
                          onChange={handleblackoutHourChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
                    <CustomWidthTooltip title={BlackoutStartHourInfo}>
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack style={{ width: "80%" }} spacing={3}>
                        <TimePicker
                          label="Blackout end hour"
                          value={blackoutEndHour}
                          onChange={handleblackoutHourChange}
                          renderInput={(params) => <TextField {...params} />}
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
                  <div className="userconfig__maincontent__form__inside__containers userconfig__blackout__date__picker__container">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack style={{ width: "80%" }} spacing={3}>
                        <DesktopDatePicker
                          label="Blackout Date"
                          inputFormat="MM/dd/yyyy"
                          value={blackoutDate}
                          onChange={handleblackoutDateChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
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
                <div className="userconfig__maincontent__form__submit__button__container">
                  <Stack spacing={2} direction="row">
                    <Button onClick={userConfigSubmit} variant="contained">
                      Submit
                    </Button>
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserConfig;

import React, { useState, useEffect, useContext } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import "./ifivrselected.css";

import MainDTMF from "./main__dtmf/MainDTMF";
import { CommonContext } from "../../../../../helpers/CommonContext";

const IfIVRSelected = () => {
  const { 
    welcomePromptWaitTime, 
    setWelcomePromptWaitTime,
    numberOfMainDTMFWhenIVRIsSelected,
    setnumberOfMainDTMFWhenIVRIsSelected,
   } = useContext(CommonContext);



  const handleChange = (event) => {
    setnumberOfMainDTMFWhenIVRIsSelected(event.target.value);
  };

  const [arr1, setArr] = useState([]);
  useEffect(() => {
    var arr = [];
    for (var i = 1; i < numberOfMainDTMFWhenIVRIsSelected + 1; i++) {
      arr.push(i);
    }
    setArr(arr);
  }, [numberOfMainDTMFWhenIVRIsSelected]);

  const numberOfDTMF = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  // const howManyDTMFToShow = (numberOfMainDTMFWhenIVRIsSelected) => {

  // };

  return (
    <>
      <div className="if__ivr__selected">
        <div className="if__ivr__selected__container">
          <div className="main__wait__time__and__dtmf__container">
            <div className="main__wait__time__container">
              <Box
                component="form"
                style={{ width: "80%" }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="if__IVR__selected"
                  type="number"
                  value={welcomePromptWaitTime}
                  onChange={(e)=>{setWelcomePromptWaitTime(e.target.value)}}
                  label="Welcome prompt Wait Time"
                  variant="outlined"
                />
              </Box>
            </div>

            <div className="main__dtms__container">
              <FormControl style={{ width: "80%" }}>
                <InputLabel id="demo-simple-select-label">DTMF</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={numberOfMainDTMFWhenIVRIsSelected}
                  label="DTMF"
                  onChange={handleChange}
                >
                  {numberOfDTMF.map((number, index) => {
                    return <MenuItem value={number}>{number}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>
            {/* {howManyDTMFToShow(numberOfMainDTMFWhenIVRIsSelected)} */}
          </div>

          <div className="ifIVRselected__number__of__DTMF__to__show__container">
            {arr1.length > 0 &&
              arr1.map((el, ind) => {
                return <MainDTMF dtmfNumber={el} />;
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default IfIVRSelected;

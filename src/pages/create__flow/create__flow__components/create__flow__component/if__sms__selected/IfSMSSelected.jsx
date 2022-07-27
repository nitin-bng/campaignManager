import React, { useState, useEffect }  from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import './ifsmsselected.css'
import MainInput from "./main__input/MainInput";



const IfSMSSelected = () => {

    const [
        numberOfMainInputsWhenIVRIsSelected,
        setnumberOfMainInputsWhenIVRIsSelected,
      ] = React.useState("");
      const handleChange = (event) => {
        setnumberOfMainInputsWhenIVRIsSelected(event.target.value);
      };
    
      const [arr1, setArr] = useState([]);
      useEffect(() => {
        var arr = [];
        for (var i = 1; i < numberOfMainInputsWhenIVRIsSelected + 1; i++) {
          arr.push(i);
        }
        setArr(arr);
      }, [numberOfMainInputsWhenIVRIsSelected]);
      const numberOfInputs = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ];
  return (
    <>
      <div className="if__sms__selected">
        <div className="if__sms__selected__container">
          <div className="main__delay__time__and__inputs__container">
            <div className="main__delay__time__container">
              <Box
                component="form"
                style={{ width: "80%" }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="if__sms__selected"
                  type="number"
                  label="Delay Time"
                  variant="outlined"
                />
              </Box>
            </div>

            <div className="main__Inputs__container">
              <FormControl style={{ width: "80%" }}>
                <InputLabel id="demo-simple-select-label">Inputs</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={numberOfMainInputsWhenIVRIsSelected}
                  label="Inputs"
                  onChange={handleChange}
                >
                  {numberOfInputs.map((number, index) => {
                    return <MenuItem value={number}>{number}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </div>
            {/* {howManyInputsToShow(numberOfMainInputsWhenIVRIsSelected)} */}
          </div>

          <div className="ifSMSSelected__number__of__Inputs__to__show__container">
            {arr1.length > 0 &&
              arr1.map((el, ind) => {
                return <MainInput InputsNumber={el} />;
              })}
          </div>
          
        </div>
      </div>
    </>
  )
}

export default IfSMSSelected
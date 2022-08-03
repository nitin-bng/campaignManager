import React, { useState, useEffect } from 'react'

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SubInput from '../sub__input/SubInput';



const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));
  
  const numberOfSubDTMF = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  

const MainInput = (props) => {

    const [expanded, setExpanded] = React.useState(false);
// console.log(props);
  const [
    numberOfMainDTMFWhenIVRIsSelected,
    setnumberOfMainDTMFWhenIVRIsSelected,
  ] = React.useState("");

  const [
    selectOptionForMainDTMF,
    setSelectOptionForMainDTMF,
  ] = React.useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChange = (event) => {
    setSelectOptionForMainDTMF(event.target.value);
  };

  const handleIVRSelectedChange = (event) => {
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

  return (
    <>
          <div className="main__dtmf">
        <div className="main__dtmf__container">
          <Card style = {{backgroundColor:"rgba(0, 0, 0, 0.04)", padding:"1rem"}} fullWidth>
            <CardActions disableSpacing>
              <Typography paragraph>Inputs : {props.InputsNumber} </Typography>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{ display:"flex", justifyContent:"flex-end"}}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <div className="main__dtmf__maincontent__container">
                  <div className="dtmf__select__option__container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Input option
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectOptionForMainDTMF}
                        label="DTMF__option"
                        onChange={handleChange}
                      >
                        {["HitURL", "Schedule SMS"].map((number, index) => {
                          // console.log(number);
                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="main__dtmf__wait__time__container">
                    <Box
                      component="form"
                      style={{ width: "100%" }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="if__IVR__selected"
                        type="number"
                        label="Delay Time"
                        variant="outlined"
                      />
                    </Box>
                  </div>
                  <div className="select__number__of__subDTMF__from__main__dtmf__container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Input
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={numberOfMainDTMFWhenIVRIsSelected}
                        label="Input"
                        onChange={handleIVRSelectedChange}
                      >
                        {numberOfSubDTMF.map((number, index) => {
                          // console.log(number);

                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </CardContent>
              <div className="rendering__subdtmf__container">
              {arr1.length > 0 &&
                arr1.map((el, ind) => {
                  return <SubInput numberOfSubDTMF={el}/>;
                })}

              </div>
              
            </Collapse>
          </Card>
        </div>
      </div>
    </>
  )
}

export default MainInput
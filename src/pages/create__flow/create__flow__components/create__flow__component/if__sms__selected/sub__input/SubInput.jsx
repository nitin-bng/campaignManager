import React, {useState, useEffect} from "react";

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

const SubInput = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    // console.log(props);
    const [
      numberOfMainDTMFWhenIVRIsSelected,
      setnumberOfMainDTMFWhenIVRIsSelected,
    ] = React.useState("");
  
    const [selectOptionForMainDTMF, setSelectOptionForMainDTMF] =
      React.useState("");
  
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
      <div className="subDTMF__subdtmf">
        <div className="sudDTMF__subdtmf__container">
          <Card style={{ backgroundColor: "white", width: props.width }}>
            <CardActions disableSpacing>
              <Typography paragraph>
                SUB Input : {props.numberOfSubDTMF}{" "}
              </Typography>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{
                  // width: "75%",
                  // border:"2px solid red",
                  borderRadius: "0",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <div className="main__dtmf__maincontent__container">
                  <div className="subdtmf__select__option__container">
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
                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="main__subdtmf__wait__time__container">
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
                  <div className="select__number__of__subDTMF__from__subdtmf__container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Input
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-select"
                        value={numberOfMainDTMFWhenIVRIsSelected}
                        label="Input"
                        onChange={handleIVRSelectedChange}
                      >
                        {numberOfSubDTMF.map((number, index) => {
                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </CardContent>
              <div className="rendering__sub__subdtmf__container">
                {arr1.length > 0 &&
                  arr1.map((el, ind) => {
                    return (
                      <div style={{ border: "2px solid blue" }}>
                        <SubInput width="225%" numberOfSubDTMF={el} />
                      </div>
                    );
                  })}
              </div>
            </Collapse>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubInput;

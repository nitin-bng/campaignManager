import React, { useState, useEffect, useContext } from "react";

import "./maindtmf.css";

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

import SubDTMF from "../sub__dtmf/SubDTMF";
import { store } from "../../../../../../store/store";
import { findAndModifyFirst } from "obj-traverse/lib/obj-traverse";

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

const MainDTMF = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  console.log("props props props", props);
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

  const globalState = useContext(store);
  let localStore = globalState.state;
  const { disableChannel } = props;
  console.log("dtmfs options", props);
  // const { fileuploadclick } = props;

  const { dispatch } = globalState;

  const genArray = (n) => {
    return Array(n)
      .fill()
      .map((x, i) => i + 1);
  };

  const detectLevel = (e, target, current) => {
    debugger;
    handleIVRSelectedChange(e);
    console.log("dtmfs--- options", props, e, target, current);
    if (target === "main_audio") {
      props.handleDataChange(e);
    } else if (target === "sub_audio_dtmfs") {
      props.setDataDynamic("sub_audio_dtmfs", e, current);
    } else {
      let oldNumOfCards = 0;
      const newNumOfCards = e.target.value;

      if (current && current.dtmf_count) {
        oldNumOfCards = current.dtmf_count;
      }

      console.log(
        "globalState.state.ivrCampFlowData.flow ",
        localStore.ivrCampFlowData.flow,
        "CURRENT.... ",
        current
      );
      console.log(
        "OLD NUMBER OF CARDS.... ",
        oldNumOfCards,
        "NEW NUMBER OF CARDS.... ",
        newNumOfCards
      );

      if (newNumOfCards >= oldNumOfCards) {
        debugger;
        let languageSelect = {};
        localStore.ivrCampFlowData.flow.languageChange.map((e) => {
          languageSelect[e] = "";
        });
        genArray(newNumOfCards - oldNumOfCards).map((e) => {
          e = oldNumOfCards + e;
          console.log(
            "%c......PUSH.....",
            "background: 'pink'; 'font-size: 1.5rem",
            e
          );
          localStore.ivrCampFlowData.flow.actions[current.id - 1].actions.push({
            dtmf_key: e,
            parent_dtmf: current.dtmf_key,
            audio_file: {},
            action_tag: "",
            sms: "",
            file: {
              ivr: languageSelect,
              sms: languageSelect,
            },
            node_type: "PROCESSING",
            input: {
              ivr_key: e,
              sms_key: "",
            },
            actionType: {
              ivr: "",
              sms: "",
            },
            type: "PLAY",
            level: current.level + 1,
            waitTime: 0,
            url: "",
            actions: [
              {
                dtmf_key: 1,
                parent_dtmf: e,
                type: "HITURL",
                level: current.level + 2,
                action_tag: "",
                sms: "",
                file: {
                  ivr: languageSelect,
                  sms: languageSelect,
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 1,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                url: "",
                parameter: "auto=true",
                url_actions: [],
                id: current.id + "_" + e + "_" + 1,
              },
              {
                dtmf_key: 2,
                parent_dtmf: e,
                type: "HITURL",
                action_tag: "",
                sms: "",
                file: {
                  ivr: languageSelect,
                  sms: languageSelect,
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 2,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                level: current.level + 2,
                url: "",
                parameter: "auto=false",
                url_actions: [],
                id: current.id + "_" + e + "_" + 2,
              },
            ],
            id: current.id + "_" + e,
            repeat: {
              value: false,
              dtmf: 0,
              audio_file: [],
              max_count: 0,
            },
          });
        });
      } else {
        for (var i = 0; i < oldNumOfCards - newNumOfCards; i++)
          localStore.ivrCampFlowData.flow.actions[current.id - 1].actions.pop();
      }

      // // dispatch('SET_DTMF_SUB', data)
      localStore.ivrCampFlowData.flow.actions[current.id - 1].dtmf_count =
        newNumOfCards;
      dispatch({ type: "SET_DATA", nState: localStore });

      //TO-DO : Write using SET_DTMF_SUB
    }
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
          <Card
            style={{ backgroundColor: "rgba(0, 0, 0, 0.04)", padding: "1rem" }}
            fullWidth
          >
            <CardActions disableSpacing>
              <Typography paragraph>DTMF : {props.dtmfNumber} </Typography>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{ display: "flex", justifyContent: "flex-end" }}
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
                        DTMF option
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectOptionForMainDTMF}
                        label="DTMF__option"
                        onChange={(e) => {
                          handleChange(e);
                          props.dataHandleWithObj(
                            e,
                            props.global || props.current
                          );
                        }}
                        name="type"
                      >
                        {["PLAY", "Schedule SMS"].map((number, index) => {
                          console.log(number);
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
                        // id="if__IVR__selected"
                        id={"waitTime_" + props.global.dtmf_key}
                        disabled={
                          // disableProperties &&
                          disableChannel == "SMS" ||
                          // !disableProperties &&
                          disableChannel == "SMS"
                        }
                        type="number"
                        label="Main Wait iolkljk Time"
                        name={"waitTime_" + props.global.dtmf_key}
                        value={
                          globalState.state.ivrCampFlowData.flow.actions[
                            props.global.dtmf_key - 1
                          ].waitTime
                        }
                        onChange={(e) =>
                          props.setWaitTime(
                            "sub",
                            e.target,
                            props.global.dtmf_key
                          )
                        }
                        variant="outlined"
                      />
                    </Box>
                  </div>
                  <div className="select__number__of__subDTMF__from__main__dtmf__container">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-label">
                        main DTMF
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={numberOfMainDTMFWhenIVRIsSelected}
                        label="DTMF"
                        name="sub_audio_dtmfs_dtmfCount"
                        onChange={(e) => {
                          detectLevel(e, "sub_audio_dtmfs", props.global);
                        }}
                      >
                        {numberOfSubDTMF.map((number, index) => {
                          console.log(number);

                          return <MenuItem value={number}>{number}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </CardContent>
              <div className="rendering__subdtmf__container">
                {/* {arr1.length > 0 &&
                  arr1.map((el, ind) => { */}
                {props.global.actions.map((e, index) => {
                  return (
                    <SubDTMF
                      data={props}
                      current={e}
                      handleDataChange={props.handleDataChange}
                      onChange={props.handleChange}
                      uploadFiles={props.uploadFiles}
                      setWaitTime={props.setWaitTime}
                      setDataDynamic={props.setDataDynamic}
                      parentNumber={props.dtmfNumber}
                      numberOfSubDTMF={e}
                      dataHandleWithObj={props.dataHandleWithObj}
                      // disableProperties={disableProperties}
                      // disableChannel={disableChannel}
                    />
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

export default MainDTMF;

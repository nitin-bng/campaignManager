import React, {useContext, useState} from 'react'



import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { store } from '../../store/store';

  
  const DtmfDropdown = (props) => {
    let globalState = useContext(store);
    const { dispatch } = globalState;
    let localStore = globalState.state;

    const [
        numberOfMainDTMFWhenIVRIsSelected,
        setnumberOfMainDTMFWhenIVRIsSelected,
      ] = React.useState("");

      const detectLevel = (e, target, current) => {
        handleIVRSelectedChange(e);
        
        if (target === "main_audio") {
          handleDataChange(e);
        } else if (target === "sub_audio_dtmfs") {        
        } else {
          let oldNumOfCards = 0;
          const newNumOfCards = e.target.value;
    
          if (current && current.dtmf_count) {
            oldNumOfCards = current.dtmf_count;
          }
    
          if (newNumOfCards >= oldNumOfCards) {
            debugger;
            let languageSelect = {};
            localStore.ivrCampFlowData.flow.languageChange.map((e) => {
              languageSelect[e] = "";
            });
    
            genArray(newNumOfCards - oldNumOfCards).map((e) => {
              e = oldNumOfCards + e;          
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
    
          
          localStore.ivrCampFlowData.flow.actions[current.id - 1].dtmf_count =
            newNumOfCards;
          dispatch({ type: "SET_DATA", nState: localStore });
        }
      };
    
    
      const handleDataChange = (e) => {
        debugger;
        const key = e.target.name;
        if (key === "main_audio_dtmfCount") {
          localStore.ivrCampFlowData.flow[key] = e.target.value;
          dispatch({ type: "SET_DTMF_MAIN", nState: localStore });
        }
        
      };
      const handleIVRSelectedChange = (event) => {
        setnumberOfMainDTMFWhenIVRIsSelected(event.target.value);
      };
    
      const genArray = (n) => {
        debugger;
        return Array(n)
          .fill()
          .map((x, i) => i + 1);
      };
    
    
      const numberOfSubDTMF = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ];
    
  return (
    <div className="select__number__of__subDTMF__from__main__dtmf__container">
    <FormControl style={{ width: "100%" }}>
      <InputLabel id="demo-simple-select-label">
        rishabh
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={numberOfMainDTMFWhenIVRIsSelected}
        label="DTMF"
        onChange={(e) => {

          detectLevel(e, "main_audio", props.current);
          
        }}
      >
        {numberOfSubDTMF.map((number, index) => {
          

          return <MenuItem value={number}>{number}</MenuItem>;
        })}
      </Select>
    </FormControl>
  </div>
  )
}

export default DtmfDropdown
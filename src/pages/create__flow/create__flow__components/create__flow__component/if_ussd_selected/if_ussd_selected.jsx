import { TextField } from "@material-ui/core";
import { useContext, useEffect } from "react";
import { useError } from "../../../../../store/errorContext";
import { store } from "../../../../../store/store";
import TextareaAutosize from "@mui/base/TextareaAutosize";

const IfUssdSelected = ({hideItemStyle}) =>{
    const globalState = useContext(store);
    const {dispatch} = globalState
    const localStore = globalState.state
    const {showError, setShowError, errorDispatch} = useError()

    useEffect(() => {
        if(hideItemStyle === undefined){
            setShowError(false);
            errorDispatch({ type: "IF_USSD_SELECTED", payload: false })
        }
        return ()=> errorDispatch({ type: "IF_USSD_SELECTED", payload: true });
      }, []);
    
      useEffect(() => {
        if(hideItemStyle === undefined){
            if (
            localStore.ivrCampFlowData.flow.main_file.ussd._E
        ) {
          errorDispatch({ type: "IF_USSD_SELECTED", payload: true });
        } else {
          errorDispatch({ type: "IF_USSD_SELECTED", payload: false });
        }}
      }, [
        localStore.ivrCampFlowData.flow.main_file.ussd._E
      ]);

    const handleUSSD = (msg) => {
        localStore.ivrCampFlowData.flow['type'] = "HITURL_USSD"
        localStore.ivrCampFlowData.flow.main_file.ussd['_E'] = msg
        localStore.ivrCampFlowData.flow["main_audio_file"] = msg
        dispatch({ type: "SET_MAIN_AUDIO_FILE", nState: localStore });
    }

  return (
    <div
      className={hideItemStyle}
      hideItem
      style={{
        width: "100%",
        // marginLeft:"10%"
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <TextField
        id="outlined-multiline-static"
        label="Type Your Message here"
        multiline
        rows={10}
        variant="outlined"
        value={localStore.ivrCampFlowData.flow.main_file.ussd._E}
        onChange={(e) => handleUSSD(e.target.value)}
        error={
          showError
            ? localStore.ivrCampFlowData.flow.main_file.ussd._E
              ? false
              : true
            : false
        }
        style={{ marginLeft:"5%", width:"90%"}}
      />
    </div>
  );
};

export { IfUssdSelected };

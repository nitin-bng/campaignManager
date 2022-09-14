import { TextField } from "@material-ui/core"
import { useContext } from "react";
import {store} from "../../../../../store/store"

const IfUssdSelected = ({hideItemStyle}) =>{
    const globalState = useContext(store);
    const {dispatch} = globalState
    const localStore = globalState.state
    console.log('Nitin', localStore.ivrCampFlowData.flow)


    const handleUSSD = (msg) => {
        localStore.ivrCampFlowData.flow['type'] = "HITURL_USSD"
        localStore.ivrCampFlowData.flow.main_file.ussd = msg
        localStore.ivrCampFlowData.flow["main_audio_file"] = msg
        dispatch({ type: "SET_MAIN_AUDIO_FILE", nState: localStore });
    }

    return (
        <div className={hideItemStyle} hideItem>
            <TextField value={localStore.ivrCampFlowData.flow.main_file.ussd} onChange={(e)=>handleUSSD(e.target.value)}>This is message</TextField>
        </div>
    )
}

export {IfUssdSelected}
import { createContext, useContext, useReducer, useState } from "react";

const initialValue = {
    createFlowComponent: true,
    rederingComponentOnLanguageSelect: true,
    ifIvrSelected: true,
    mainDtmf: true,
    subDtmf: true,
    createCampaign: true,
    audioError: []
}

const errorReducer = (state, action) =>{

switch (action.type) {
    case "INITIALIZE":
        return {...initialValue}
    case "CREATE_FLOW_COMPONENT":
        return {...state, createFlowComponent: action.payload}
    case "RENDERING_COMPONENT_ON_LANGUAGE_SELECT":
        return {...state, rederingComponentOnLanguageSelect: action.payload}
    case "IF_IVR_SELECTED":
        return {...state, ifIvrSelected: action.payload}
    case "MAIN_DTMF":
        return {...state, mainDtmf: action.payload}
    case "SUB_DTMF":
        return {...state, subDtmf: action.payload}
    case "CREATE_CAMPAIGN":
        return {...state, createCampaign: action.payload}
    case "AUDIO":
        let newVal = state.audioError
        if(action.payload){
            newVal.push(true)
        }
        else{
            newVal.pop()
        }
        return {...state, audioError:newVal}
    default:
        return state
}

}


const ErrorContext = createContext()

const ErrorProvider = ({children}) =>{
    const [showError, setShowError] = useState(false)
    const [errorState, errorDispatch] = useReducer(errorReducer,initialValue)


    return <ErrorContext.Provider value={{showError, setShowError, errorState, errorDispatch}}>
        {children}
    </ErrorContext.Provider>
}

const useError =()=> useContext(ErrorContext)

export {useError, ErrorProvider}
import { createContext, useContext, useReducer, useState } from "react";

const initialValue = {
    createFlowComponent: true,
    rederingComponentOnLanguageSelect: true,
    ifIvrSelected: true,
    createCampaign: true,
    mainDtmf: [],
    subDtmf: [],
    audioError: [],
}

const errorReducer = (state, action) =>{
let newVal = ''
switch (action.type) {
    case "INITIALIZE":
        return {...initialValue, audioError: []}
    case "CREATE_FLOW_COMPONENT":
        return {...state, createFlowComponent: action.payload}
    case "RENDERING_COMPONENT_ON_LANGUAGE_SELECT":
        return {...state, rederingComponentOnLanguageSelect: action.payload}
    case "IF_IVR_SELECTED":
        return {...state, ifIvrSelected: action.payload}
    case "MAIN_DTMF":
         newVal = state.mainDtmf
        if(action.payload){
            newVal.push(true)
        }
        else{
            newVal.pop()
        }
        return {...state, mainDtmf:newVal}
    case "SUB_DTMF":
         newVal = state.subDtmf
        if(action.payload){
            newVal.push(true)
        }
        else{
            newVal.pop()
        }
        return {...state, subDtmf:newVal}
    case "CREATE_CAMPAIGN":
        return {...state, createCampaign: action.payload}
    case "AUDIO":
         newVal = state.audioError
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
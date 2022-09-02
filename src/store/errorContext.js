import { createContext, useContext, useReducer } from "react";

const initialValue = {
    createFlowComponent: true,
    rederingComponentOnLanguageSelect: true,
    ifIvrSelected: true,
    mainDtmf: true,
    subDtmf: true
}

const errorReducer = (state, action) =>{

switch (action.type) {
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
    default:
        return state
}

}


const ErrorContext = createContext()

const ErrorProvider = ({children}) =>{
    const [errorState, errorDispatch] = useReducer(errorReducer,initialValue)


    return <ErrorContext.Provider value={{errorState, errorDispatch}}>
        {children}
    </ErrorContext.Provider>
}

const useError =()=> useContext(ErrorContext)

export {useError, ErrorProvider}
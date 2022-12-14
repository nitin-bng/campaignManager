import React, { useState } from "react";

export const CommonContext = React.createContext();

export const CommonProvider = ({ children }) => {
  const [dtmfTime, setdtmfTime] = useState([]);
  const [dtmfTimeHindi, setDtmfTimeHindi] = useState();
  const [dtmfTimeEnglish, setDtmfTimeEnglish] = useState();
  const [dtmfTimeArabic, setDtmfTimeArabic] = useState();
  const [dtmfTimeSpanish, setDtmfTimeSpanish] = useState();

  const [flowName, setFlowName] = useState();
  const [channel, setChannel] = useState();
  const [ifIVRselectedThenLanguage, setIfIVRselectedThenLanguage] = useState([]);
  const [welcomePromptWaitTime, setWelcomePromptWaitTime] = useState();
  const [numberOfMainDTMFWhenIVRIsSelected,setnumberOfMainDTMFWhenIVRIsSelected] = useState("");
  const [campaignName, setCampaignName] = useState()


  const [languageJson, setLangugeJson] = useState([]);


  return (
    <CommonContext.Provider
      value={{    
        flowName,
        setFlowName,
        channel,
        setChannel,   
        dtmfTime,
        setdtmfTime,
        dtmfTimeHindi,
        setDtmfTimeHindi,
        dtmfTimeEnglish,
        setDtmfTimeEnglish,
        dtmfTimeArabic,
        setDtmfTimeArabic,
        dtmfTimeSpanish,
        setDtmfTimeSpanish,
        ifIVRselectedThenLanguage,
        setIfIVRselectedThenLanguage,
        welcomePromptWaitTime,
        setWelcomePromptWaitTime,
        numberOfMainDTMFWhenIVRIsSelected,
        setnumberOfMainDTMFWhenIVRIsSelected,
        campaignName,
        setCampaignName,
        languageJson, 
        setLangugeJson, 
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

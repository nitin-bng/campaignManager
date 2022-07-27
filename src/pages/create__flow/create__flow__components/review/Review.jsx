import React from 'react'
import { useContext } from 'react'
import { CommonContext } from '../../../../helpers/CommonContext'

import './review.css'

const Review = () => {

    const{
        // basic flow details
        flowName,
        setFlowName,
        channel,
        setChannel,
        // basic flow details
    
        // if ivr selected
        // wait time context
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
        // wait time context
        //if ivr selected
    
        // ceateCampaign
        campaignName,
        setCampaignName,
        // ceateCampaign
    } = useContext(CommonContext)

    return (
    <>
        <div className="review">
            <div className="review__container">
                <div className="reviewContainers flownameContainer">
                    <h4>Flow Name : </h4>
                    <p>{flowName}</p>
                </div>
                <div className="reviewContainers channelContainer">
                    <h4>Channel Selected : </h4>
                    <p>{channel}</p>
                </div>
                <div className="reviewContainers selectedLanguageContainer">
                    <h4>Language/s selected : </h4>
                    <p>{ifIVRselectedThenLanguage}</p>
                </div>
                
           
                <div className="reviewContainers campaignNameContainer">
                    <h4>Campaign Name : </h4>
                    <p>{campaignName}</p>
                </div>
                <div className="reviewContainers priorityContainer">
                    <h4>Priority : </h4>
                    <p>hello</p>
                </div>
                <div className="reviewContainers campaignTypeContainer">
                    <h4>Campaign Type : </h4>
                    <p>hello</p>
                </div>
                
                <div className="reviewContainers operatorContainer">
                    <h4>Operator : </h4>
                    <p>hello</p>
                </div>
                <div className="reviewContainers campaignDayStartTimeContainer">
                    <h4>Day starting Time : </h4>
                    <p>hello</p>
                </div>
                <div className="reviewContainers campaignDayStopTimeContainer">
                    <h4>Day Stopping Time : </h4>
                    <p>hello</p>
                </div>
                <div className="reviewContainers campaignRunDatesContainer">
                    <h4>Dates : </h4>
                    <p>hello</p>
                </div>

            </div>
        </div>
    </>
  )
}

export default Review
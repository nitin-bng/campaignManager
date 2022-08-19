import React, { useContext } from "react";
import MenuAppBar from "../../components/topbar/MenuAppBar";
import "./createflow.css";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import CreateFlowComponent from "./create__flow__components/create__flow__component/CreateFlowComponent.jsx";
import CreateCampaign from "./create__flow__components/create__campaign/CreateCampaign";
import ScheduleCampaign from "./create__flow__components/schedule__campaign/ScheduleCampaign";
import Review from "./create__flow__components/review/Review";
import { CommonContext } from "../../helpers/CommonContext";
import { store } from "../../store/store";
import config from "../../ApiConfig/Config";
// import MainDTMF from "./create__flow__components/create__flow__component/if__ivr__selected/main__dtmf/MainDTMF";

const steps = ["Create Flow", "Create campaign", "Schedule Campaign", "Review"];

const CreateFlow = () => {
  let globalState = useContext(store);
  const { dispatch } = globalState;
  let localStore = globalState.state;
  var dataToSend = {};

  const {
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
    // dtmfTime,
    // setdtmfTime,

    flowName,
    setFlowName,
    channel,
    setChannel,
  } = useContext(CommonContext);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    // console.log("flowName", flowName);
    // console.log("channel", channel);
    // console.log("ifIVRselectedThenLanguage", ifIVRselectedThenLanguage);
    // console.log("dtmfTimeHindi", dtmfTimeHindi);
    // console.log("dtmfTimeEnglish", dtmfTimeEnglish);
    // console.log("dtmfTimeArabic", dtmfTimeArabic);
    // console.log("dtmfTimeSpanish", dtmfTimeSpanish);
    // console.log("welcomePromptWaitTime", welcomePromptWaitTime);
    // console.log("numberOfMainDTMFWhenIVRIsSelected", numberOfMainDTMFWhenIVRIsSelected);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    console.log("local store on click of next button", localStore);
    const userId = JSON.parse(localStorage.getItem("userId"));

    dataToSend = {
      service_Data: {
        userid: userId,
        name: "form.campaign_name",
        start_date: "getFormattedDate(form.startdateTime)",
        end_date: "getFormattedDate(form.enddateTime)",
        start_time: "getFormattedTime(form.startdateTime)",
        end_time: "getFormattedTime(form.enddateTime)",
        priority: "5",
        status: "scheduled",
        is_capping: "true",
        service_id: "getServiceId(form.service)",
        service_name: "form.service",
        operator_id: "form.operator",
        publisher_id: "1",
        agency: "1",
        advertiser: "1",
        media_type: "AUDIO",
        device_type: "mobile",
        description: "form.description",
        kpi: "vv",
        type: "IVR",
        flow: "JSON",
        max_click_count: "0",
        max_impression_count: "0",
        total_click_count: "99999",
        total_impression_count: "888777",
        // 'service_name': form.service,
        campaign_frequency: "form.CampaignFrequency",
      },
      timezone: {
        operator: "+",
        timezonevalue: "00:00",
      },
      blackouthour: "form.blackouthour",
      flow: globalState.state.ivrCampFlowData.flow,
      publisher: null,
      device: null,
      country: null,
    };

    fetch(
      config.server.path +
        config.server.port +
        config.api.createFlowWithoutContent,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      }
    )
      .then(async (response) => {
        var res = await response.json();
        console.log("campaign submitted--response", res);
        if (response.status !== 200 || response.status === "FAILED") {
          // setFormSubmitted(false);
        } else {
          getCompleteFlow(res.wfId);
          // setFormSubmitted(true);
        }
      })
      .catch((e) => console.log("error in submitting form", e));
  };

  const getCompleteFlow = (id) => {
    debugger
    // const path = 'http//:34.214.61.86:5000/bng/ui/flowjson?wfId=' + id
    let localStore = globalState.state;
    fetch('http://34.214.61.86:5000/bng/ui/flowjson?wfId=' + id + '&flowName=' + localStorage.getItem('flowName'), {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(function (data) {
            return data;

        }).catch(function (error) {
            console.log("failed", error);
            return error;
        })
}

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <>
      <div className="create__flow">
        <div className="create__flow__container">
          <div className="navbar__container">
            <div className="navbar">
              <MenuAppBar />
            </div>
          </div>
          <div className="create__flow__maincontent__container">
            <div className="create__flow__maincontent">
              <Box
                className="create__flow__maincontent__box"
                sx={{ width: "100%", height: "100%" }}
              >
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Typography style={{ height: "85%" }} sx={{ mt: 2, mb: 1 }}>
                      {activeStep === 0 ? (
                        <CreateFlowComponent />
                      ) : activeStep === 1 ? (
                        <CreateCampaign />
                      ) : activeStep === 2 ? (
                        <ScheduleCampaign />
                      ) : activeStep === 3 ? (
                        <Review />
                      ) : (
                        ""
                      )}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />

                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFlow;

import React, { useContext, useState } from "react";
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
import classNames from "classnames";
import { useError } from "../../store/errorContext";

const steps = ["Create Flow", "Create campaign", "Schedule Campaign", "Review"];

const CreateFlow = () => {
  let globalState = useContext(store);

  const {showError,setShowError, errorState, errorDispatch} = useError()
  const {ifIVRselectedThenLanguage} = useContext(CommonContext)

  const { dispatch } = globalState;
  let localStore = globalState.state;
  var dataToSend = {};
  var createCampDataToSend = {};
  const [hideItem, setHideItem] = useState(true);
  const hideItemStyle = classNames("file__chooser__container", {
    hideInput: hideItem,
    showInput: !hideItem,
  });
  const [FlowListData, setFlowListData] = useState([]);

  const [activeStep, setActiveStep] = React.useState(0);
  const getFlowList = () => {
    console.log("get flow list called");
    debugger;
    const path = "http://34.214.61.86:5000/bng/ui/list/flows";
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        debugger;
        console.log("get flowList", data);
        data.unshift({ flowName: "select", id: "select", wfId: "select" });
        setFlowListData(data);
        return data;
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  };

  const checkMandatoryFields = () => {
    let result = true;
    const keys = Object.keys(errorState);
    console.log('function', errorState)
    for (let key of keys) {
      if(Array.isArray(errorState[key]) && errorState[key].length !== 0){
        result = false;
        break

      }else{
      if (!errorState[key]) {
        result = false;
        break;
      }}
      
    }
    return result;
  };

  // const checkAudioError = () => {
  //   let result = true
  //   for(let val of audioError){
  //     if(val === false){
  //       result = true
  //       break
  //     }
  //   }
  //   return result
  // }

  // console.log("Nitin", errorState, showError, audioError);

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

    if(checkMandatoryFields()){
      console.log('Nitin, function ran')
     
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setShowError(false)
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

    createCampDataToSend = {
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



    
      if (activeStep === 0) {
        console.log("activeStep === 0");
        fetch(
          config.server.path +
            config.server.port +
            config.api.createFlowWithoutContent,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(createCampDataToSend),
          }
        )
          .then(async (response) => {
            var res = await response.json();
            console.log("flow without content submitted--response", res);
            if (response.status !== 200 || response.status === "FAILED") {
              // setFormSubmitted(false);
            } else {
              getCompleteFlow(res.wfId);
              localStorage.setItem("wfId", res.wfId);
              // setFormSubmitted(true);
            }
          })
          .catch((e) => console.log("error in submitting form", e));

        const getCompleteFlow = (id) => {
          debugger;
          // const path = 'http//:34.214.61.86:5000/bng/ui/flowjson?wfId=' + id
          let localStore = globalState.state;
          fetch(
            "http://34.214.61.86:5000/bng/ui/flowjson?wfId=" +
              id +
              "&flowName=" +
              localStorage.getItem("flowName"),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataToSend),
            }
          )
            .then((response) => response.json())
            .then(function (data) {
              getFlowList();

              return data;
            })
            .catch(function (error) {
              console.log("failed", error);
              return error;
            });
        };
      } else if (activeStep === 1) {
        console.log("activeStep === 1");


        const path =
          "http://34.214.61.86:5000/bng/ui/flow/content?isContent=true&campId=" +
          localStorage.getItem("campId") +
          "&wfId=" +
          localStorage.getItem("wfId");
        fetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        })
          .then(async (response) => {
            var res = await response.json();
            console.log("campaign submitted--response", res);
            // setLoading(false);
            if (response.status !== 200 || response.status === "FAILED") {
              // return false;
              // setFormSubmitted(false);
            } else {
              //TO DO : RESET STORE
              // setFormSubmitted(true);
              // dispatch({ type: 'EMPTY_DATA', nState: null });
              // return true;
            }
            // .then(e => {
            //     console.log("campaign submitted--response", e,);
            //     return e;
          })
          .catch((e) => console.log("error in submitting form", e));
      } else if (activeStep === 2) {
        console.log("activeStep === 2");
      } else if (activeStep === 3) {
        console.log("activeStep === 3");
      }
    } else {
      console.log('Nitin, function failed')
      setShowError(true);
    }
        };

  const handleBack = () => {
    errorDispatch({type:'INITIALIZE'})

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
                sx={{ width: "100%", height: "100%", overflow: "scroll" }}
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
                  <>
                    <Typography style={{ height: "85%" }} sx={{ mt: 2, mb: 1 }}>
                      {activeStep === 0 ? (
                        <CreateFlowComponent hideItemStyle={hideItemStyle} />
                      ) : activeStep === 1 ? (
                        <CreateCampaign
                          disableEditingWhileCreatingCamp={true}
                          getFlowList={getFlowList}
                          FlowListData={FlowListData}
                          setFlowListData={setFlowListData}
                          hideItemStyle={hideItemStyle}
                        />
                      ) : activeStep === 2 ? (
                        <ScheduleCampaign
                          disableEditingWhileCreatingCamp={true}
                          hideItemStyle={hideItemStyle}
                        />
                      ) : activeStep === 3 ? (
                        <Review />
                      ) : (
                        ""
                      )}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        position: "fixed",
                        width: "90%",
                        backgroundColor: "white",
                        flexDirection: "row",
                        pt: 2,
                      }}
                    >
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
                  </>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
  
export default CreateFlow

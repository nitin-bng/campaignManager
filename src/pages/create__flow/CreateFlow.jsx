import React, { useContext, useEffect, useState } from "react";
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
import { makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import { useError } from "../../store/errorContext";
import { useNavigate } from "react-router-dom";

const steps = ["Create Flow", "Create campaign", "Schedule Campaign", "Review"];

const CreateFlow = () => {
  const navigate = useNavigate();
  let globalState = useContext(store);
  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      marginTop: "191px",
      color: "Gray",
      justifyContent: "center",
      margin: "0 auto",
    },
    color: {
      color: "gray",
      margin: "0 auto",
    },
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    table: {
      minWidth: 250,
    },
    tr: {
      textAlign: "center",
    },
  }));
  const classes = useStyles();
  const { errorState, errorDispatch, setShowError } = useError();
  const { setChannel } = useContext(CommonContext);
  var [tabledata3, setData3] = useState([]);
  const { dispatch, campaignName } = globalState;
  let localStore = globalState.state;
  var dataToSend = {};
  var createCampDataToSend = {};
  const hideItemStyle = classNames("file__chooser__container", {
    hideInput: true,
    showInput: false,
  });
  const [FlowListData, setFlowListData] = useState([]);
  const [showFlowTable, setShowFlowTable] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  var flowDataFromApi = {};
  const [openModal, setOpenModal] = useState(false);

  const [activeStep, setActiveStep] = React.useState(0);
  var rows3 = [];
  function createData3(
    id,
    wfId,
    flowName,
    channelSupported,
    languageSupported
  ) {
    return { id, wfId, flowName, channelSupported, languageSupported };
  }
  const getFlowList = () => {
    console.log("get flow list called");
    debugger;
    const path = `http://41.217.203.246:5002/bng/ui/list/flows?userId=${localStorage.getItem(
      "userId"
    )}`;
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        debugger;
        console.log("get flowList", data);
        data.unshift({ flowName: "select", id: "select", wfId: "select" });
        setFlowListData(data);
        setShowFlowTable(false)
        errorDispatch({ type: "INITIALIZE" });
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
    console.log("function", errorState);
    for (let key of keys) {
      if (Array.isArray(errorState[key]) && errorState[key].length !== 0) {
        result = false;
        break;
      } else {
        if (!errorState[key]) {
          result = false;
          break;
        }
      }
    }
    return result;
  };

  const handleNext = () => {
    console.log(
      "dtmf count",
      globalState.state.ivrCampFlowData.flow.main_audio_dtmfCount
    );
    if (checkMandatoryFields()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setShowError(false);
      console.log("local store on click of next button", localStore);
      const userId = JSON.parse(localStorage.getItem("userId"));

      dataToSend = {
        service_Data: {
          userid: userId,
          name: campaignName,
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
          name: campaignName,
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
            config.server.port2 +
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
            } else {
              getCompleteFlow(res.wfId);
              localStorage.setItem("wfId", res.wfId);
            }
          })
          .catch((e) => console.log("error in submitting form", e));

        const getCompleteFlow = (id) => {
          fetch(
            "http://41.217.203.246:5002/bng/ui/flowjson?wfId=" +
              id +
              "&flowName=" +
              localStorage.getItem("flowName") +
              "&userId=" +
              localStorage.getItem("userId"),
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
      } else if (activeStep === 2) {
        console.log("activeStep === 2");
      } else if (activeStep === 3) {
        console.log("activeStep === 3");
        navigate("/campaign-manager/home");
      }
    } else {
      setShowError(true);
    }
  };

  const flowFromApi = (data) => {
    debugger;
    let localStore = globalState.state;
    console.log("local store ... ", localStore);
    localStore.ivrCampFlowData.flow = data;
    dispatch({ type: "SET_DATA", nState: localStore });
    console.log("hello hello hello", globalState);
  };

  const getFlow = async (e, id) => {
    debugger;
    localStorage.setItem("wfId", id);
    const path = "http://41.217.203.246:5002/bng/ui/get/flow?wfId=" + id;
    return await fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        localStorage.setItem("channelName", data.flow.channel);
        localStorage.setItem("flowName", data.service_Data.name);
        console.log("dataFrom api call ", data);
        flowDataFromApi = data.flow;

        console.log("flowDataFromApi", flowDataFromApi);
        flowFromApi(data.flow);
        setOpenModal(true);
        setChannel(flowDataFromApi.channel);
        localStore.ivrCampFlowData.flow.channel = flowDataFromApi.channel;
        localStorage.setItem("channelName", flowDataFromApi.channel);
        dispatch({ type: "SET_DATA", nState: localStore });
        return data;
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  };
  const handleModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    const path = `http://41.217.203.246:5002/bng/ui/list/flows?userId=${localStorage.getItem(
      "userId"
    )}`;
    fetch(path)
      .then((res) => {
        res.json().then((res) => {
          console.log("rishabh res", res);
          if (res.length > 0) {
            rows3 = [];
            res.map((params) => {
              console.log("params", JSON.parse(params.json));
              console.log("params", params);
              const parsedJSON = JSON.parse(params.json);
              rows3.push(
                createData3(
                  params.id,
                  params.wfId,
                  params.flowName,
                  parsedJSON.flow.channel,
                  parsedJSON.flow.language[0].actions.map(
                    (item) => item.languageName
                  )
                )
              );
            });
            setData3(rows3);
          } else if (res.length == 0) {
            setData3([]);
          }
        });
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  }, []);

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
                <Stepper className="stepper" activeStep={activeStep}>
                  {steps.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <>
                  <Typography style={{ height: "85%" }} sx={{ mt: 2, mb: 1 }}>
                    {activeStep === 0 ? (
                      <>
                        {showFlowTable ? (
                          <>
                            <div
                              className="row"
                              style={{
                                width: "90%",
                                margin: "2rem auto",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <button
                                style={{
                                  padding: ".5rem 1rem",
                                  border: "none",
                                  outline: "none",
                                  backgroundColor: " #374151",
                                  color: "white",
                                  textTransform: "uppercase",
                                  textShadow: "1px 1px 2px black",
                                  width: "20%",
                                  margin: "1rem 0",
                                  transition: "all 0.5s",
                                  fontWeight: "700",
                                  alignSelf: "flex-end",
                                }}
                                className="closeBtn"
                                onClick={() => setShowFlowTable(false)}
                              >
                                Create New Flow
                              </button>
                              <div className="col-sm-12">
                                <div
                                  className="basic__flow__details__heading__container"
                                  style={{ padding: "1rem 0" }}
                                >
                                  <h1>List of created Flows</h1>
                                </div>
                                <div className="table-responsive table-striped ctable">
                                  <TableContainer component={Paper}>
                                    <Table
                                      className={classes.table}
                                      aria-label="simple table"
                                    >
                                      <TableHead
                                        className="thead-light"
                                        style={{
                                          backgroundColor: "lightgray",
                                          borderBottom: "2px solid black",
                                        }}
                                      >
                                        <TableRow>
                                          <TableCell align="center">
                                            S. No.
                                          </TableCell>
                                          {console.log(tabledata3)}
                                          <TableCell align="center">
                                            Flow Name
                                          </TableCell>
                                          <TableCell align="center">
                                            Channel Supported
                                          </TableCell>
                                          <TableCell align="center">
                                            Language supported
                                          </TableCell>
                                          <TableCell align="center">
                                            Preview flow
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {tabledata3.map((row) => (
                                          <TableRow
                                            key={row.id}
                                            value={row.wfId}
                                            className="tableRow"
                                          >
                                            <TableCell align="center">
                                              {row.id}
                                            </TableCell>
                                            <TableCell align="center">
                                              {row.flowName}
                                            </TableCell>
                                            <TableCell align="center">
                                              {row.channelSupported}
                                            </TableCell>
                                            <TableCell align="center">
                                              {row.languageSupported.map(
                                                (ele) => {
                                                  return (
                                                    <span> &nbsp;{ele},</span>
                                                  );
                                                }
                                              )}
                                            </TableCell>
                                            <TableCell align="center">
                                              <button
                                                style={{
                                                  padding: ".5rem 1rem",
                                                  border: "none",
                                                  outline: "none",
                                                  backgroundColor: " #374151",
                                                  color: "white",
                                                  textTransform: "uppercase",
                                                  textShadow:
                                                    "1px 1px 2px black",
                                                  transition: "all 0.5s",
                                                  fontWeight: "700",
                                                }}
                                                className="closeBtn"
                                                onClick={() => {
                                                  getFlow(row.id, row.wfId);
                                                }}
                                              >
                                                Preview
                                              </button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </div>
                              </div>
                            </div>
                            {openModal && (
                              <div
                                className="bg-modal"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  position: "fixed",
                                  left: "0",
                                  top: "0",
                                }}
                              >
                                <div
                                  className="modal-content"
                                  style={{
                                    width: "90vw",
                                    height: "90vh",
                                  }}
                                >
                                  <CreateFlowComponent
                                    hideItemStyle={hideItemStyle}
                                    disableEditingWhileCreatingCamp={true}
                                  />
                                  {console.log(
                                    "hello hello hello",
                                    globalState
                                  )}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems:"center",
                                    justifyContent:"space-around"
                                  }}
                                >

                                <button
                                  style={{
                                    padding: ".5rem 1rem",
                                    border: "none",
                                    outline: "none",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    textTransform: "uppercase",
                                    textShadow: "1px 1px 1px black",
                                    width: "10%",
                                    marginTop: "1rem",
                                    marginBottom: ".5rem",
                                    transition: "all 0.5s",
                                    fontWeight: "700",
                                  }}
                                  className="closeBtn"
                                  onClick={(e) => handleModal(e)}
                                >
                                  Select other flow
                                </button>

                                <button
                                  style={{
                                    padding: ".5rem 1rem",
                                    border: "none",
                                    outline: "none",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    textTransform: "uppercase",
                                    textShadow: "1px 1px 1px black",
                                    width: "10%",
                                    marginTop: "1rem",
                                    marginBottom: ".5rem",
                                    transition: "all 0.5s",
                                    fontWeight: "700",
                                  }}
                                  className="closeBtn"
                                  onClick={(e) =>{
                                    navigate('/campaign-manager/create__flow')
                                    setActiveStep(1)
                                    getFlowList()
                                  }}
                                >
                                  Select This Flow
                                </button>

                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <CreateFlowComponent
                            reset={false}
                            hideItemStyle={hideItemStyle}
                          />
                        )}
                      </>
                    ) : activeStep === 1 ? (
                      <CreateCampaign
                        disableEditingWhileCreatingCamp={true}
                        getFlowList={getFlowList}
                        FlowListData={FlowListData}
                        setFlowListData={setFlowListData}
                        hideItemStyle={hideItemStyle}
                        setDisableNext={setDisableNext}
                      />
                    ) : activeStep === 2 ? (
                      <ScheduleCampaign
                        disableEditingWhileCreatingCamp={true}
                        hideItemStyle={hideItemStyle}
                        setDisableNext={setDisableNext}
                        handleNext = {handleNext}
                      />
                    ) : activeStep === 3 ? (
                      <Review />
                    ) : (
                      ""
                    )}
                  </Typography>
                  <Button
                    className="NextButton"
                    onClick={handleNext}
                    disabled={disableNext || showFlowTable}
                    style={{
                      position: "fixed",
                      bottom: "40px",
                      right: "80px",
                      backgroundColor: "#374151",
                      padding: "0.5rem 1rem",
                      color: "white",
                      marginRight: ".5rem",
                      fontWeight: "700",
                      textShadow: "2px 2px 2px black",
                      transition: "all .5s",
                    }}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFlow;

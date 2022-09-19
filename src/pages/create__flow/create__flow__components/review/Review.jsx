import React, { useContext, useEffect, useState } from "react";

import "./review.css";
import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";

import TextField from "@mui/material/TextField";
import { store } from "../../../../store/store";
const Review = () => {
  const [api, setApi] = useState(false);

  const globalState = useContext(store);
  let localStore = globalState.state;
  const [expanded, setExpanded] = React.useState(true);
  const [expanded2, setExpanded2] = React.useState(true);
  const [expanded3, setExpanded3] = React.useState(true);

  const [campCreateData, setCampCreateData] = useState([]);
  const [campScheduleData, setCampScheduleData] = useState([]);

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandClick2 = () => {
    setExpanded2(!expanded2);
  };
  const handleExpandClick3 = () => {
    setExpanded3(!expanded3);
  };

  const getCampaignDataList = () => {
    const path = `http://41.217.203.246:5002/bng/ui/list/campaign?userId=${localStorage.getItem(
      "userId"
    )}`;
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        console.log("get flowList", data);
        // data.unshift({ campName: "select" });
        // setCampaignListData(data);
        data.forEach((element) => {
          console.log("rishabh running runnig");
          console.log("===========>", element);
          console.log("===========>", element.wfId);
          if (localStorage.getItem("wfId") == element.wfId) {

            setCampCreateData(element);
          } else {
            console.log("than than gopal");
          }
          // console.log(campaignName);
        });
        return data;
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  };

  const getcampaignScheduleList = () => {
    fetch(
      `http://41.217.203.246:5002/bng/ui/list/campschedule?userId=${localStorage.getItem(
        "userId"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        res.json().then((res) => {
          console.log("campCreateDatacampCreateDatacampCreateData", campCreateData);
          {
            res.map((element)=>{
                console.log("elementelement", element.jobName, campCreateData.campName);
                if(campCreateData.campName==element.jobName){
                    setCampScheduleData({...element, endDate: element.endDate.slice(0,10)})
                    setCampScheduleData({...element, startDate: element.endDate.slice(0,10)})
                }
            })
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCampaignDataList();
    getcampaignScheduleList();
  },[api]);

  useEffect(()=>{
    if(!campCreateData.campName && !campScheduleData.jobName){
      setApi((prev)=> !prev)
    }
  },[api])

  let languages = [];
  languages.push(
    localStore.ivrCampFlowData.flow.language[0].actions.map(
      (item) => item.languageName
    )
  );
  return (
    <>
      <div className="review">
        <div className="review__container">
          {/* flow details */}
          <Card
            style={{ backgroundColor: "white", padding: ".5rem" }}
            fullWidth
          >
            <CardActions disableSpacing>
              <Typography paragraph>Flow Details </Typography>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent style={{ padding: "0rem 0rem 1rem 0rem" }}>
                <div
                  className="reviewFlowDetails"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div className="feilds" style={{ width: "40%" }}>
                    <TextField
                      disabled
                      id="outlined-basic"
                      label="Work Flow Name"
                      variant="outlined"
                      value={localStore.ivrCampFlowData.flow.flowName}
                    />
                  </div>
                  <div className="feilds" style={{ width: "40%" }}>
                    <TextField
                      disabled
                      id="outlined-basic"
                      label="Workflow Id"
                      variant="outlined"
                      value={localStorage.getItem("wfId")}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ marginTop: "1rem", width: "40%" }}
                  >
                    <TextField
                      disabled
                      id="outlined-basic"
                      label="Languages Selected"
                      variant="outlined"
                      value={languages}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ marginTop: "1rem", width: "40%" }}
                  >
                    <TextField
                      disabled
                      id="outlined-basic"
                      label="Channel Selected"
                      variant="outlined"
                      value={localStore.ivrCampFlowData.flow.channel}
                    />
                  </div>
                </div>
              </CardContent>
            </Collapse>
          </Card>

          {/* create campaign details */}
          <Card
            style={{
              backgroundColor: "white",
              padding: ".5rem",
              marginTop: "1rem",
            }}
            fullWidth
          >
            <CardActions disableSpacing>
              <Typography paragraph>Created campaigns details</Typography>
              <ExpandMore
                expand={expanded2}
                onClick={handleExpandClick2}
                aria-expanded={expanded2}
                aria-label="show more"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded2} timeout="auto" unmountOnExit>
              <CardContent style={{ padding: "0rem 0rem 1rem 0rem" }}>
                <div
                  className="reviewFlowDetails"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999" }}
                  >
                    <TextField
                      disabled
                      id="outlined-basic"
                      label="Campaign ID"
                      variant="outlined"
                      value={localStorage.getItem("campId")}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{
                      width: "40%",
                      position: "relative",
                      zIndex: "999",
                    }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Campaign Name
                    </InputLabel>
                    <TextField
                      disabled
                      id="outlined-basic"
                      //   label="Campaign Name"
                      variant="outlined"
                      value={campCreateData.campName}
                    />
                    {console.log("campCreateData", campCreateData)}
                  </div>
                  <div
                    className="feilds"
                    style={{
                      width: "40%",
                      marginTop: "1rem",
                      position: "relative",
                      zIndex: "999",
                    }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Work Flow Id
                    </InputLabel>

                    <TextField
                      disabled
                      id="outlined-basic"
                      //   label="Work Flow Id"
                      variant="outlined"
                      value={campCreateData.wfId}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{
                      width: "40%",
                      marginTop: "1rem",
                      position: "relative",
                      zIndex: "999",
                    }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Campaign Priority
                    </InputLabel>
                    <TextField
                      disabled
                      id="outlined-basic"
                      //   label="Campaign Priority"
                      variant="outlined"
                      value={campCreateData.campPriority}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{
                      width: "40%",
                      marginTop: "1rem",
                      position: "relative",
                      zIndex: "999",
                    }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Campaign Type
                    </InputLabel>
                    <TextField
                      disabled
                      id="outlined-basic"
                      //   label="Campaign Type"
                      variant="outlined"
                      value={campCreateData.campaign_type}
                    />
                  </div>
                </div>
              </CardContent>
            </Collapse>
          </Card>

          {/* scheduled campaign */}
          <Card
            style={{
              backgroundColor: "white",
              padding: ".5rem",
              marginTop: "1rem",
            }}
            fullWidth
          >
            <CardActions disableSpacing>
              <Typography paragraph>Scheduled Campaigns Details </Typography>
              <ExpandMore
                expand={expanded3}
                onClick={handleExpandClick3}
                aria-expanded={expanded3}
                aria-label="show more"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded3} timeout="auto" unmountOnExit>
              <CardContent>
                <div
                  className="reviewFlowDetails"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999", position:"relative",}}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Campaign ID
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Campaign ID"
                        variant="outlined"
                        value={campScheduleData.campId}
                    />
                    {console.log("campScheduleDatacampScheduleData", campScheduleData)}
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999", position:"relative",}}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Channel Selected
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Channel Selected"
                        variant="outlined"
                        value={campScheduleData.channel}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Country Selected
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Country Selected"
                        variant="outlined"
                        value={campScheduleData.country}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Daily Start Time
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Daily Start Time"
                        variant="outlined"
                        value={campScheduleData.dailyStartTime}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Daily End Time
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Daily End Time"
                        variant="outlined"
                        value={campScheduleData.dailyEndTime}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Start Date
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Start Date"
                        variant="outlined"
                        value={campScheduleData.startDate}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      End Date
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="End Date"
                        variant="outlined"
                        value={campScheduleData.endDate}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Operator
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Operator"
                        variant="outlined"
                        value={campScheduleData.operator}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Priority
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Priority"
                        variant="outlined"
                        value={campScheduleData.priority}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Campaign Status
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Campaign Status"
                        variant="outlined"
                        value={campScheduleData.status}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Reserved Balance
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Reserved Balance"
                        variant="outlined"
                        value={campScheduleData.reserveBalance}
                    />
                  </div>
                  <div
                    className="feilds"
                    style={{ width: "40%", zIndex: "999",position:"relative", marginTop:"1rem" }}
                  >
                    <InputLabel
                      style={{
                        padding: "0 5px",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "-8px",
                        left: "10px",
                        zIndex: "1000",
                        fontSize: "12px",
                        color: "grey",
                      }}
                    >
                      Uploaded CSV File Name
                    </InputLabel>
                    <TextField 
                    disabled
                        id="outlined-basic"
                        // label="Uploaded CSV File Name"
                        variant="outlined"
                        value={campScheduleData.fileName}
                    />
                  </div>
                </div>
              </CardContent>
            </Collapse>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Review;

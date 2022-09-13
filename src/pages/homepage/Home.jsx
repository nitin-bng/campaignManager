import React, { useState, useEffect, useContext } from "react";
import MenuAppBar from "../../components/topbar/MenuAppBar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

import {
  DoughnutChartData,
  DoughnutChartData2,
} from "../../helpers/All__mapping";
import "./home.css";
import { makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import classNames from "classnames";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { store } from "../../store/store";
import CreateFlowComponent from "../create__flow/create__flow__components/create__flow__component/CreateFlowComponent";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

var names = [];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Home = () => {
  const globalState = useContext(store);
  const {
    dispatch,
    setCampaignName,
    campaignName,
    campaignSchedulePriority,
    setCampaignSchedulePriority,
  } = globalState;

  const [agencies, setAgencies] = useState(0);
  const [publishers, setPublishers] = useState(0);
  const [advertisers, setAdvertisers] = useState(0);
  // const [campaigns, setCampaigns] = useState(0);
  const [runningCamp, setRunningCamp] = useState(0);
  const [pausedCamp, setPausedCamp] = useState(0);
  const [totalCamp, setTotalCamp] = useState(0);
  var [tabledata, setData] = useState([]);
  var [tabledata2, setData2] = useState([]);
  var [tabledata3, setData3] = useState([]);
  const [campaignListData, setCampaignListData] = useState([]);
  const [ivrChannel, setIvrChannel] = useState();
  const [smsChannel, setSmsChannel] = useState();
  const [age, setAge] = useState("");
  const [callSuccess, setCallSuccess] = useState([]);
  const [callFail, setCallFail] = useState([]);
  const [callRetry, setCallRetry] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [flowData, setFlowData] = useState({});
  var [channelName, getChannelName] = useState(null);
  var flowDataFromApi = {};
  const [FlowListData, setFlowListData] = useState([]);
  var rows = [];
  var rows2 = [];
  var rows3 = [];
  var flowId = "";
  const [showFlowState, setShowFlowState] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  function createData(campId, campName, campPriority, wfId, serviceName) {
    return { campId, campName, campPriority, wfId, serviceName };
  }

  function createData2(
    jobId,
    jobName,
    startDate,
    endDate,
    dailyStartTime,
    dailyEndTime,
    priority,
    status
  ) {
    return {
      jobId,
      jobName,
      startDate,
      endDate,
      dailyStartTime,
      dailyEndTime,
      priority,
      status,
    };
  }
  function createData3(id, wfId, flowName) {
    return { id, wfId, flowName };
  }

  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "flex",
      marginTop: "191px",
      // overflow: 'hidden',
      color: "Gray",
      justifyContent: "center",
      margin: "0 auto",
      // marginLeft:'270px'
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
      minWidth: 650,
    },
    tr: {
      textAlign: "center",
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    debugger;

    const path = `http://34.214.61.86:5002/bng/ui/list/flows?userId=${localStorage.getItem(
      "userId"
    )}`;
    fetch(path)
      .then((res) => {
        res.json().then((res) => {
          console.log("rishabh res", res);
          if (res.length > 0) {
            rows3 = [];
            res.map((params) => {
              rows3.push(createData3(params.id, params.wfId, params.flowName));
            });
            setData3(rows3);
            // setFlowListData(rows3);
          } else if (res.length == 0) {
            setData3([]);
          }
        });
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });

    fetch(
      `http://34.214.61.86:5002/bng/ui/list/campaign?userId=${localStorage.getItem(
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
          if (res.length > 0) {
            rows = [];
            res.map((params) => {
              rows.push(
                createData(
                  params.campId,
                  params.campName,
                  params.campPriority,
                  params.wfId,
                  params.serviceName
                )
              );
            });
            setData(rows);
          } else if (res.length == 0) {
            setData([]);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });

    fetch(
      `http://34.214.61.86:5002/bng/ui/list/campschedule?userId=${localStorage.getItem(
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
          if (res.length > 0) {
            rows2 = [];
            res.map((params) => {
              rows2.push(
                createData2(
                  params.jobId,
                  params.jobName,
                  params.startDate.slice(0, 10),
                  params.endDate.slice(0, 10),
                  params.dailyStartTime,
                  params.dailyEndTime,
                  params.priority,
                  params.status
                )
              );
            });
            setData2(rows2);
            // console.log("rishabh res", res);
          } else if (res.length == 0) {
            setData2([]);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });

    // console.log("rishabh ran");
    // getFlowList()
    getCampaignList();
    getChannelPercentage();
    // getcampaignScheduleList();
  }, []);

  const getChannelPercentage = () => {
    debugger;
    const path = "http://34.214.61.86:5000/bng/ui/job/channel/percent";
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        setIvrChannel(data.ivr);
        setSmsChannel(data.sms);
        return data;
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  };

  const getCampaignList = () => {
    const path = "http://34.214.61.86:5000/bng/ui/list/campaign";
    fetch(path)
      .then((response) => response.json())
      .then(function (data) {
        // console.log("get flowList", data);
        // data.unshift({ campName: "select work flow" });
        setCampaignListData(data);
        return data;
      })
      .catch(function (error) {
        console.log("failed", error);
        return error;
      });
  };

  const getNumberOfAgencies = async () => {
    const path =
      "Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getUserList + '?user_type=agency'";
    fetch(path)
      .then((response) => response.json())
      .then((data) => {
        // console.log("List of agencies", data.userList);
        const numberOfAgencies = data.userList.length;
        setAgencies(numberOfAgencies);
        const newElement = {
          title: "Number of Agencies",
          value: numberOfAgencies,
        };
        setDataList((oldArray) => [...oldArray, newElement]);
      })
      .catch(() => {
        return <p>Agencies not found</p>;
      });
  };

  const getNumberOfPublishers = async () => {
    const path =
      " Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getUserList + '?user_type=publisher'";
    fetch(path)
      .then((response) => response.json())
      .then((data) => {
        // console.log("List of publishers", data.userList);
        const numberOfPublishers = data.userList.length;
        setPublishers(numberOfPublishers);
        const newElement = {
          title: "Number of Publishers",
          value: numberOfPublishers,
        };
        setDataList((oldArray) => [...oldArray, newElement]);
      })
      .catch(() => {
        return <p>Publishers not found</p>;
      });
  };

  const getNumberOfAdvertisers = async () => {
    const path =
      "Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getUserList + '?user_type=advertiser'";
    fetch(path)
      .then((response) => response.json())
      .then((data) => {
        // console.log("List of advertisers", data.userList);
        const numberOfAdvertisers = data.userList.length;
        setAdvertisers(numberOfAdvertisers);
        const newElement = {
          title: "Number of Advertisers",
          value: numberOfAdvertisers,
        };
        setDataList((oldArray) => [...oldArray, newElement]);
      })
      .catch(() => {
        return <p>Advertisers not found</p>;
      });
  };

  const getNumberOfCampaigns = async () => {
    // console.log("GET NUMBER OF CAMPAIGNS");
    let runningCamp = 0;
    let pausedCamp = 0;
    const path =
      " Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getCampaignList" +
      "?camptype=all";
    fetch(path)
      .then((response) => response.json())
      .then((data) => {
        // console.log("DATA", data.status);
        const campList = data.bundleOptionList;
        // console.log("List of campaigns", campList);
        const totalCamp = campList.length;
        setTotalCamp(totalCamp);

        campList.forEach((item) => {
          if (item.status.toLowerCase() == "running") runningCamp++;
          else if (item.status.toLowerCase() == "paused") pausedCamp++;
        });

        setRunningCamp(runningCamp);
        setPausedCamp(pausedCamp);
        setTotalCamp(totalCamp);
        // console.log("FINAL DATA", dataList);
      })
      .catch(() => {
        return <p>Campaigns not found</p>;
      });
  };

  const flowFromApi = (data) => {
    debugger;
    let localStore = globalState.state;
    console.log("local store ... ", localStore);
    localStore.ivrCampFlowData.flow = data;
    dispatch({ type: "SET_DATA", nState: localStore });
    console.log("hello hello hello", globalState);
  };

  const dashBoardDataFromApi = async () => {
    const path = `http://34.214.61.86:5002/bng/ui/dashboard/${localStorage.getItem(
      "userId"
    )}`;
    fetch(path)
      .then((response) => response.json())
      .then((data) => {
        console.log("dashBoardDataFromApi", data);
        data.campName.map((ele)=>{
          return(
            names.push(ele)

          )
        })
      })
      .catch(() => {
        return <p>dashboard data not available</p>;
      });
  };

  useEffect(() => {
    getNumberOfAgencies();
    getNumberOfPublishers();
    getNumberOfAdvertisers();
    getNumberOfCampaigns();
    dashBoardDataFromApi();
    // getcampaignScheduleList();
  }, []);

  const [hideItem, setHideItem] = useState(true);
  const hideItemStyle = classNames("file__chooser__container", {
    hideInput: hideItem,
    showInput: !hideItem,
  });

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <>
      <div className="home">
        <div className="navbar__container">
          <div className="navbar">
            <MenuAppBar />
          </div>
        </div>
        <div className="home__container">
          <div className="home__maincontent__container">
            <div className="home__maincontent">
              <div className="home__maincontent__card__container">
                <div
                  className="home__maincontent__card home__maincontent__card2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // height: "40vh",
                    margin: "1rem",
                    padding: "1rem",
                    border: "2px solid green",
                  }}
                >
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      // multiple
                      value={personName}
                      onChange={handleChange}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, personName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Doughnut
                    width={"30%"}
                    options={{ maintainAspectRatio: false }}
                    data={DoughnutChartData}
                  />
                </div>
                <div
                  className="home__maincontent__card home__maincontent__card4"
                  style={{ display: "flex",
                  flexDirection: "column",
                  // height: "40vh",
                  margin: "1rem",
                  padding: "1rem",
                  border: "2px solid green",}}
                >
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      // multiple
                      value={personName}
                      onChange={handleChange}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, personName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Doughnut
                    width={"30%"}
                    options={{ maintainAspectRatio: false }}
                    data={DoughnutChartData2}
                  />
                </div>
                <div
                  className="home__maincontent__card home__maincontent__card3"
                  style={{ width: "96%", margin: "1rem" }}
                >
                  <Line
                    height={"80%"}
                    data={{
                      labels: [
                        new Date().getDate() -
                          5 +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() -
                          4 +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() -
                          3 +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() -
                          2 +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() -
                          1 +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                        new Date().getDate() +
                          "-" +
                          new Date().getMonth() +
                          "-" +
                          new Date().getFullYear(),
                      ],

                      datasets: [
                        {
                          label: "Success",
                          data: [
                            callSuccess[5],
                            callSuccess[4],
                            callSuccess[3],
                            callSuccess[2],
                            callSuccess[1],
                            callSuccess[0],
                          ],
                          fill: true,
                          backgroundColor: "rgb(75,192,192)",
                          borderColor: "rgba(75,192,192)",
                        },
                        {
                          label: "Failure",
                          data: [
                            callFail[5],
                            callFail[4],
                            callFail[3],
                            callFail[2],
                            callFail[1],
                            callFail[0],
                          ],
                          fill: false,
                          backgroundColor: "#742774",
                          borderColor: "#742774",
                        },
                        {
                          label: "Progress",
                          data: [
                            callRetry[5],
                            callRetry[4],
                            callRetry[3],
                            callRetry[2],
                            callRetry[1],
                            callRetry[0],
                          ],
                          fill: false,
                          backgroundColor: "rgb(255, 127, 14)",
                          borderColor: "rgb(255, 127, 14)",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* flow list */}

          {/* <div
            className="row"
            style={{
              // border: "2px solid red",
              width: "70%",
              margin: "2rem auto",
              boxSizing: "border-box",
            }}
          >
            <div className="col-sm-12">
              <div
                className="basic__flow__details__heading__container"
                style={{ padding: "1rem 0" }}
              >
                <h1>List of created Flows</h1>
              </div>
              <div className="table-responsive table-striped ctable">
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead className="thead-light">
                      <TableRow>
                        <TableCell align="center">Id</TableCell>
                        {console.log(tabledata3)}
                        <TableCell align="center">Flow Name</TableCell>
                        <TableCell align="center">Work Flow Id</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tabledata3.map((row) => (
                        <TableRow
                          onClick={(e) => {
                            console.log(row.id);
                            getFlow(row.id, row.wfId);
                          }}
                          key={row.id}
                          value={row.wfId}
                          className="tableRow"
                        >
                          {console.log(tabledata3)}
                          <TableCell align="center">{row.id}</TableCell>
                          <TableCell align="center">{row.flowName}</TableCell>
                          <TableCell align="center">{row.wfId}</TableCell>
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
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                className="modal-content"
                style={{
                  // border: "2px solid red",
                  width: "90vw",
                  height: "90vh",
                }}
              >
                <CreateFlowComponent
                  hideItemStyle={hideItemStyle}
                  disableEditingWhileCreatingCamp={true}
                />
                {console.log("hello hello hello", globalState)}
              </div>
              <button
                style={{
                  padding: ".5rem 1rem",
                  border: "none",
                  outline: "none",
                  backgroundColor: " #374151",
                  color: "white",
                  textTransform: "uppercase",
                  textShadow: "1px 1px 2px black",
                  width: "10%",
                  marginTop: "1rem",
                  marginBottom: ".5rem",
                  transition: "all 0.5s",
                  fontWeight: "700",
                }}
                className="closeBtn"
                onClick={(e) => handleModal(e)}
              >
                Ok
              </button>
            </div>
          )} */}

          {/* camp list */}
          {/* <div
            className="row"
            style={{
              // border: "2px solid red",
              width: "70%",
              margin: "2rem auto",
              boxSizing: "border-box",
            }}
          >
            <div className="col-sm-12">
              <div
                className="basic__flow__details__heading__container"
                style={{ padding: "1rem 0" }}
              >
                <h1>List of created Campaigns</h1>
              </div>
              <div className="table-responsive table-striped ctable">
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead className="thead-light">
                      <TableRow>
                        <TableCell align="center"> Camp Id</TableCell>
                        <TableCell align="center">Camp Name</TableCell>
                        <TableCell align="center">Priority</TableCell>
                        <TableCell align="center">Work Flow Id</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tabledata.map((row) => (
                        <TableRow key={row.service_id} className="tableRow">
                          <TableCell align="center">{row.campId}</TableCell>
                          <TableCell align="center">{row.campName}</TableCell>
                          <TableCell align="center">
                            {row.campPriority}
                          </TableCell>
                          <TableCell align="center">{row.wfId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div> */}

          {/* scheduleed */}

          <div
            className="listContainer row"
            style={{
              // border: "2px solid red",
              width: "91%",
              margin: "2rem auto",
              boxSizing: "border-box",
            }}
          >
            <div className="card-body text-center p-0 col-sm-12">
              <div
                className="basic__flow__details__heading__container"
                style={{ padding: "1rem 0" }}
              >
                <h1>List of scheduled Campaigns</h1>
              </div>
              <div className="table-responsive table-striped ctable">
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead
                      className="thead-light"
                      style={{
                        backgroundColor: "lightgray",
                        borderBottom: "2px solid black",
                      }}
                    >
                      <TableRow>
                        <TableCell align="center">S. No.</TableCell>
                        <TableCell align="center">Camp Name</TableCell>
                        <TableCell align="center">Start Date</TableCell>
                        <TableCell align="center">End Date</TableCell>
                        <TableCell align="center">Start Time</TableCell>
                        <TableCell align="center">End Time</TableCell>
                        <TableCell align="center">Priority</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tabledata2.map((row) => (
                        <TableRow key={row.service_id} className="tableRow">
                          {console.log(tabledata2)}
                          <TableCell align="center">{row.jobId}</TableCell>
                          <TableCell align="center">{row.jobName}</TableCell>
                          <TableCell align="center">{row.startDate}</TableCell>
                          <TableCell align="center">{row.endDate}</TableCell>
                          <TableCell align="center">
                            {row.dailyStartTime}
                          </TableCell>
                          <TableCell align="center">
                            {row.dailyEndTime}
                          </TableCell>
                          <TableCell align="center">{row.priority}</TableCell>
                          <TableCell align="center">{row.status}</TableCell>
                          <TableCell align="center">
                            <FormGroup style={{}}>
                              {row.status == "SCHEDULED" ? (
                                <>
                                  <FormGroup>
                                    <FormControlLabel
                                      disabled
                                      control={<Switch />}
                                      label="Disabled"
                                      labelPlacement="bottom"
                                    />
                                  </FormGroup>
                                </>
                              ) : (
                                <>
                                  <FormGroup>
                                    <FormControlLabel
                                      control={<Switch defaultChecked />}
                                      label="Label"
                                      labelPlacement="bottom"
                                    />
                                  </FormGroup>
                                </>
                              )}
                            </FormGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

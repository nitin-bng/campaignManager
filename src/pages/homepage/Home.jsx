import React, { useState, useEffect, useContext } from "react";
import MenuAppBar from "../../components/topbar/MenuAppBar";
// import faker from 'faker';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
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
import FormGroup from "@mui/material/FormGroup";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CancelIcon from "@material-ui/icons/Cancel";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import DeleteIcon from "@material-ui/icons/Delete";
import { store } from "../../store/store";
import config from "../../ApiConfig/Config";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "aaj se phle",
    },
  },
};

const labels = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Success",
      data: [100, 1000, 500, 2000, 1500, 600, 10],
      backgroundColor: "green",
    },
    {
      label: "Failed",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "red",
    },
    {
      label: "Running",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "rgb(255, 127, 14)",
    },
    {
      label: "Total",
      data: [100000, 200000, 300000, 400000, 500000, 600000, 700000],
      backgroundColor: "rgba(53, 162, 235, 1)",
    },
  ],
};

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
  const { dispatch } = globalState;
  const [showDoughnuts, setShowDoughnuts] = useState(false);
  var [tabledata2, setData2] = useState([]);
  const [callSuccess, setCallSuccess] = useState([]);
  const [callFail, setCallFail] = useState([]);
  const [callRetry, setCallRetry] = useState([]);
  var rows2 = [];

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
      minWidth: 650,
    },
    tr: {
      textAlign: "center",
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    getcampaignScheduleList();
    dashBoardData()
  }, []);

  const dashBoardData = () => {
    fetch(
      config.server.path +
        config.server.port2 +
        `/bng/ui/dashboard/${localStorage.getItem("userId")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      res.json().then((res) => {
        console.log("res", res);
      });
    });
  };

  const getcampaignScheduleList = () => {
    fetch(
      config.server.path +
        config.server.port2 +
        `/bng/ui/list/campschedule?userId=${localStorage.getItem("userId")}`,
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
                  params.startDate?.slice(0, 10),
                  params.endDate?.slice(0, 10),
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
  };

  const dashBoardDataFromApi = async () => {
    // const path = config.server.path + config.server.port2+`/bng/ui/dashboard/${localStorage.getItem("userId")}`;
    fetch(
      config.server.path +
        config.server.port2 +
        `/bng/ui/dashboard/${localStorage.getItem("userId")}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("dashBoardDataFromApi", data);
        data.campName.map((ele) => {
          return names.push(ele);
        });
      })
      .catch(() => {
        return <p>dashboard data not available</p>;
      });
  };

  useEffect(() => {
    dashBoardDataFromApi();
  }, []);

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const handelActionChange = (action, id) => {
    console.log("action", action, id);

    fetch(
      config.server.path +
        config.server.port2 +
        `/bng/ui/update/campschedulestatus?jobId=${id}&status=${action}`
    )
      .then((result) => result.json())
      .then((res) => {
        if (res.status === "successful") {
          console.log("Response is::", res);
        } else {
          console.log("nai chala");
        }
      })
      .catch((error) => {
        console.log("the error is::", error);
      });
    getcampaignScheduleList();
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
                {showDoughnuts ? (
                  <>
                    <div
                      className="home__maincontent__card home__maincontent__card2"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "1rem",
                        padding: "1rem",
                        border: "2px solid green",
                      }}
                    >
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-name-label">
                          Name
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
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
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "1rem",
                        padding: "1rem",
                        border: "2px solid green",
                      }}
                    >
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-name-label">
                          Name
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo-multiple-name"
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
                  </>
                ) : null}

                <div
                  className="home__maincontent__card home__maincontent__card10"
                  style={{ width: "96%", marginTop: "2rem" }}
                >
                  <div className="home__maincontent__camp__select__dropdown">
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-name-label">
                        Name
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
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
                  </div>
                  <div className="home__maincontent__camp__select__dropdown">
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-name-label">
                        Name
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
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
                  </div>
                </div>

                <div
                  className="home__maincontent__card home__maincontent__card3"
                  style={{ width: "96%", margin: "1rem" }}
                >
                  <Line
                    width={100}
                    height={30}
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

                <div
                  className="home__maincontent__card home__maincontent__card3"
                  style={{ width: "96%", margin: "1rem" }}
                >
                  <Bar options={options} data={data} width={100} height={30} />
                </div>
              </div>
            </div>
          </div>
          <div
            className="listContainer row"
            style={{
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
                            <FormGroup
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {row.status == "SCHEDULED" ? (
                                <>
                                  <CancelIcon
                                    onClick={(e) => {
                                      handelActionChange("CANCELED", row.jobId);
                                    }}
                                  />
                                </>
                              ) : row.status == "RUNNING" ? (
                                <>
                                  <PauseCircleFilledIcon
                                    onClick={(e) => {
                                      handelActionChange("PAUSE", row.jobId);
                                    }}
                                  />
                                </>
                              ) : row.status == "PAUSE" ? (
                                <>
                                  <PlayCircleFilledIcon
                                    onClick={(e) => {
                                      handelActionChange("RUNNING", row.jobId);
                                    }}
                                  />
                                </>
                              ) : row.status == "EXPIRED" ? (
                                <>
                                  <CancelIcon
                                    onClick={(e) => {
                                      handelActionChange("CANCELED", row.jobId);
                                    }}
                                  />
                                </>
                              ) : row.status == "COMPLETE" ||
                                row.status == "EXPIRED" ||
                                row.status == "CANCELED" ? (
                                <>
                                  <DeleteIcon
                                    onClick={(e) => {
                                      handelActionChange("DELETED", row.jobId);
                                    }}
                                  />
                                </>
                              ) : null}
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

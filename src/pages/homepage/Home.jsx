import React, { useState, useEffect } from "react";
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
import { makeStyles } from '@material-ui/core';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Home = () => {

  const [agencies, setAgencies] = useState(0);
  const [publishers, setPublishers] = useState(0);
  const [advertisers, setAdvertisers] = useState(0);
  // const [campaigns, setCampaigns] = useState(0);
  const [runningCamp, setRunningCamp] = useState(0);
  const [pausedCamp, setPausedCamp] = useState(0);
  const [totalCamp, setTotalCamp] = useState(0);
  var [tabledata, setData] = useState([]);
  const [campaignListData, setCampaignListData] = useState([]);
  const [ivrChannel, setIvrChannel] = useState();
  const [smsChannel, setSmsChannel] = useState();
  const [age, setAge] = useState('');
  const [callSuccess, setCallSuccess] = useState([]);
  const [callFail, setCallFail] = useState([]);
  const [callRetry, setCallRetry] = useState([]);
  const [dataList, setDataList] = useState([]);

//   const useStyles = makeStyles((theme) => ({

//     wrapper: {
//         display: 'flex',
//         marginTop: '191px',
//         // overflow: 'hidden',
//         color: "Gray",
//         justifyContent: "center",
//         margin: '0 auto',
//         // marginLeft:'270px'


//     },
//     color: {
//         color: 'gray',
//         margin: '0 auto'
//     },
//     root: {
//         minWidth: 275,
//     },
//     title: {
//         fontSize: 14,
//     },
//     pos: {
//         marginBottom: 12,
//     },
//     table: {
//         minWidth: 650,
//     },
//     tr: {
//         textAlign: "center"
//     }
// }));
// const classes = useStyles();

  useEffect(() => {
    debugger;
    // fetch(`http://34.214.61.86:5002/bng/ui/list/campaign?userId=${localStorage.getItem("userId")}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => {
    //     res.json().then((res) => {
    //       if (res.length > 0) {
    //         // rows = [];
    //         res.map((params) => {
    //           // rows.push(
    //           //   createData(
    //           //     params.campId,
    //           //     params.campName,
    //           //     params.campPriority,
    //           //     params.wfId,
    //           //     params.serviceName
    //           //   )
    //           // );
    //         });
    //         // setData(rows);
    //       } else if (res.length == 0) {
    //         // setData([]);
    //       }
    //     });
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    getCampaignList();
    getChannelPercentage();
  }, []);

  const getChannelPercentage = () => {
    debugger;
    const path = 'http://34.214.61.86:5000/bng/ui/job/channel/percent'
    fetch(path)
        .then(response => response.json())
        .then(function (data) {
            setIvrChannel(data.ivr)
            setSmsChannel(data.sms)
            return data;
        }).catch(function (error) {
            console.log("failed", error);
            return error;
        })
}
const getCallPercentage = (campName) => {
    debugger;
    const path = "http://34.214.61.86:5000/bng/ui/job/status/count?campName=" + campName + "&days=6"
    fetch(path)
        .then(response => response.json())
        .then(function (data) {
            data.map((e) => {
                setCallSuccess(callSuccess.push(e.success))
                setCallFail(callFail.push(e.fail))
                setCallRetry(callRetry.push(e.retry))
            })
            console.log(callSuccess, callFail, callRetry)
            return data;
        }).catch(function (error) {
            console.log("failed", error);
            return error;
        })
}
const getCampaignList = () => {
    const path = 'http://34.214.61.86:5000/bng/ui/list/campaign'
    fetch(path)
        .then(response => response.json())
        .then(function (data) {
            console.log("get flowList", data);
            // data.unshift({ campName: "select work flow" });
            setCampaignListData(data);
            return data;

        }).catch(function (error) {
            console.log("failed", error);
            return error;
        })
}

const getNumberOfAgencies = async () => {
    const path = "Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getUserList + '?user_type=agency'";
    fetch(path)
        .then(response => response.json())
        .then(
            data => {
                console.log("List of agencies", data.userList);
                const numberOfAgencies = data.userList.length;
                setAgencies(numberOfAgencies);
                const newElement = {
                    'title': 'Number of Agencies',
                    'value': numberOfAgencies
                }
                setDataList((oldArray) => [...oldArray, newElement]);
            }
        ).catch(() => {
            return (<p>Agencies not found</p>);
        });
}

const getNumberOfPublishers = async () => {
    const path =" Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getUserList + '?user_type=publisher'";
    fetch(path)
        .then(response => response.json())
        .then(
            data => {
                console.log("List of publishers", data.userList);
                const numberOfPublishers = data.userList.length;
                setPublishers(numberOfPublishers);
                const newElement = {
                    'title': 'Number of Publishers',
                    'value': numberOfPublishers
                }
                setDataList((oldArray) => [...oldArray, newElement]);
            }
        ).catch(() => {
            return (<p>Publishers not found</p>);
        });
}

const getNumberOfAdvertisers = async () => {
    const path = "Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getUserList + '?user_type=advertiser'";
    fetch(path)
        .then(response => response.json())
        .then(
            data => {
                console.log("List of advertisers", data.userList);
                const numberOfAdvertisers = data.userList.length;
                setAdvertisers(numberOfAdvertisers);
                const newElement = {
                    'title': 'Number of Advertisers',
                    'value': numberOfAdvertisers
                }
                setDataList((oldArray) => [...oldArray, newElement]);
            }
        )
        .catch(() => {
            return (<p>Advertisers not found</p>);
        });
}

const getNumberOfCampaigns = async () => {
    console.log("GET NUMBER OF CAMPAIGNS");
    let runningCamp = 0;
    let pausedCamp = 0;
    const path =" Configs.server.path + ':' + Configs.server.port + '' + Configs.api.getCampaignList" + "?camptype=all";
    fetch(path)
        .then(response => response.json())
        .then(
            data => {
                console.log("DATA", data.status);
                const campList = data.bundleOptionList;
                console.log("List of campaigns", campList);
                const totalCamp = campList.length;
                setTotalCamp(totalCamp);

                campList.forEach((item) => {
                    if (item.status.toLowerCase() == 'running')
                        runningCamp++;
                    else if (item.status.toLowerCase() == 'paused')
                        pausedCamp++;
                });

                setRunningCamp(runningCamp);
                setPausedCamp(pausedCamp);
                setTotalCamp(totalCamp);
                console.log("FINAL DATA", dataList);
            }
        ).catch(() => {
            return (<p>Campaigns not found</p>);
        });
}

useEffect(() => {
  getNumberOfAgencies();
  getNumberOfPublishers();
  getNumberOfAdvertisers();
  getNumberOfCampaigns();
}, []);
  return (
    <>
      <div className="home">
        <div className="home__container">
          <div className="navbar__container">
            <div className="navbar">
              <MenuAppBar />
            </div>
          </div>
          <div className="home__maincontent__container">
            <div className="home__maincontent">
              <div className="home__maincontent__card__container">
                <div className="home__maincontent__card home__maincontent__card1">
                  <p
                    style={{
                      fontSize: "1.7rem",
                      fontWeight: "700",
                      textTransform: "capitalize",
                      color: "white",
                      textShadow: "1px 1px 2px black",
                    }}
                  >
                    Hi, {sessionStorage.getItem("userName")}
                  </p>
                  <br />
                  <p style={{ fontWeight: "700" }}>
                    {" "}
                    Welcome to Campaign Manager
                  </p>
                </div>
                <div className="home__maincontent__card home__maincontent__card2">
                  <Doughnut
                    width={"30%"}
                    options={{ maintainAspectRatio: false }}
                    data={DoughnutChartData}
                  />
                </div>
                <div className="home__maincontent__card home__maincontent__card3">
                  <Line
                    data={{labels: [
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
                    ],}}
                  />
                </div>
                <div className="home__maincontent__card home__maincontent__card4">
                  <Doughnut
                    width={"30%"}
                    options={{ maintainAspectRatio: false }}
                    data={DoughnutChartData2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

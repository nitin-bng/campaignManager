import React from "react";
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
  LineGraphDataOfHomePage,
} from "../../helpers/All__mapping";
import "./home.css";

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
                  card 1
                </div>
                <div className="home__maincontent__card home__maincontent__card2">
                  <Doughnut
                    width={"30%"}
                    options={{ maintainAspectRatio: false }}
                    data={DoughnutChartData}
                  />
                </div>
                <div className="home__maincontent__card home__maincontent__card3">
                  <Line data={LineGraphDataOfHomePage} />
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

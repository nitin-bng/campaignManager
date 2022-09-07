// home page sidebar mapping

export const Sidebar__menu__items = [
  {
    menu__title: "Home",
    route__path: "/home",
  },
  {
    menu__title: "Create Flow",
    route__path: "/create__flow",
  },
  {
    menu__title: "User Config",
    route__path: "/user__configuration",
  },
];

export const blackout__days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const Languages = ["Hindi", "English", "Arabic", "Spanish"];

export const DoughnutChartData = {
  labels: ["Call_Rejected", "Not_picked", "User_Busy", "Network_Error"],
  datasets: [
    {
      label: "# of Votes",
      data: [20, 40, 30, 10, 20],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
        // 'rgb(153, 102, 255)',
        // 'rgb(255, 159, 64)',
      ],
      borderWidth: 0,
    },
  ],
};

export const DoughnutChartData2 = {
  labels: ["Red", "Yellow", "Green", "Purple"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 3, 5, 2],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
      ],
      borderWidth: 0,
    },
  ],
};

// export const LineGraphDataOfHomePage = {
//   // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//   labels: [
//     new Date().getDate() -
//       5 +
//       "-" +
//       new Date().getMonth() +
//       "-" +
//       new Date().getFullYear(),
//     new Date().getDate() -
//       4 +
//       "-" +
//       new Date().getMonth() +
//       "-" +
//       new Date().getFullYear(),
//     new Date().getDate() -
//       3 +
//       "-" +
//       new Date().getMonth() +
//       "-" +
//       new Date().getFullYear(),
//     new Date().getDate() -
//       2 +
//       "-" +
//       new Date().getMonth() +
//       "-" +
//       new Date().getFullYear(),
//     new Date().getDate() -
//       1 +
//       "-" +
//       new Date().getMonth() +
//       "-" +
//       new Date().getFullYear(),
//     new Date().getDate() +
//       "-" +
//       new Date().getMonth() +
//       "-" +
//       new Date().getFullYear(),
//   ],

//   datasets: [
//     {
//       label: "Success",
//       data: [
//         callSuccess[5],
//         callSuccess[4],
//         callSuccess[3],
//         callSuccess[2],
//         callSuccess[1],
//         callSuccess[0],
//       ],
//       fill: true,
//       backgroundColor: "rgb(75,192,192)",
//       borderColor: "rgba(75,192,192)",
//     },
//     {
//       label: "Failure",
//       data: [
//         callFail[5],
//         callFail[4],
//         callFail[3],
//         callFail[2],
//         callFail[1],
//         callFail[0],
//       ],
//       fill: false,
//       backgroundColor: "#742774",
//       borderColor: "#742774",
//     },
//     {
//       label: "Progress",
//       data: [
//         callRetry[5],
//         callRetry[4],
//         callRetry[3],
//         callRetry[2],
//         callRetry[1],
//         callRetry[0],
//       ],
//       fill: false,
//       backgroundColor: "rgb(255, 127, 14)",
//       borderColor: "rgb(255, 127, 14)",
//     },
//   ],
// };

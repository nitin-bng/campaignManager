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
]

export const blackout__days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

export const Languages = [
    "Hindi",
    "English",
    "Arabic",
    "Spanish",
]

export const DoughnutChartData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
      ],
      borderWidth: 0,
    },
  ],
};

export const DoughnutChartData2 = {
  labels: ['Red', 'Yellow', 'Green', 'Purple'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 3, 5, 2],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
      ],
      borderWidth: 0,
    },
  ],
};

export const LineGraphDataOfHomePage = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "First dataset",
      data: [33, 53, 85, 41, 44, 65],
      fill: true,
      backgroundColor: "rgb(75,192,192)",
      borderColor: "rgba(75,192,192)"
    },
    {
      label: "Second dataset",
      data: [33, 25, 35, 51, 54, 76],
      fill: false,
      backgroundColor: "#742774",
      borderColor: "#742774"
    }
  ]
};
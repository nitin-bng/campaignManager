import HomeIcon from '@mui/icons-material/Home';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
export const Sidebar__menu__items = [
  {
    icon: <HomeIcon/>,
    menu__title: "Home",
    route__path: "/campaign-manager/home",
  },
  {
    icon: <AccountTreeIcon/>,
    menu__title: "Create Flow",
    route__path: "/campaign-manager/create__flow",
  },
  {
    icon: <SettingsSuggestIcon/>,
    menu__title: "User Config",
    route__path: "/campaign-manager/user__configuration",
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
      data: [20, 40, 30, 10],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",    
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
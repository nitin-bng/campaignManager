import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { Sidebar__menu__items } from "../../helpers/All__mapping";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./TemporaryDrawer.css";
export default function TemporaryDrawer(props) {
  const [state, setState] = React.useState({
    left: false,
  });

  const [activeNavItem, setActiveNaavItem] = React.useState("Home");
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement="right" />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#0f1e3b",
      color: "white",
      boxShadow: theme.shadows[1],
      fontSize: 15,
      width: "100px",
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  }));

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{ backgroundColor: "#374151", height: "100%" }}
    >
      <List>
        {Sidebar__menu__items.map((text, index) => (
          <LightTooltip title={text.menu__title}>
            <Link
              className={`sidebarListItem ${
                activeNavItem === text.menu__title ? "activeNav" : ""
              }}`}
              to={
                text.menu__title === "Create Flow" &&
                !localStorage.getItem("createFlowInMenuBarDisbled")
                  ? "/campaign-manager/user__configuration"
                  : text.route__path
              }
              onClick={()=>{
                setActiveNaavItem(text.menu__title);
                console.log('nitin called')
                props.setActiveStep && props.setActiveStep(0)
                props.setShowFlowTable && props.setShowFlowTable(true)
              }}
            >
              {console.log("activenav", activeNavItem)}
              <ListItem
                className={`sidebarListItem ${
                  activeNavItem === text.menu__title ? "activeNav" : ""
                }}`}
                key={text.menu__title}
                disablePadding
                onClick={() => {
                  text.menu__title === "Create Flow" &&
                    !localStorage.getItem("createFlowInMenuBarDisbled") &&
                    toast("You need to set up user config first");
                setActiveNaavItem(text.menu__title);

                }}
              >
                {console.log("activenav", activeNavItem)}

                <ListItemButton>
                  <ListItemIcon style={{ color: "white", fontWeight: "700" }}>
                    {text.icon}
                  </ListItemIcon>
                  <ListItemText
                    style={{
                      color: "white",
                      fontWeight: "900",
                      textShadow: "1px 1px 2px black",
                    }}
                  >
                    {text.menu__title}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
          </LightTooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MenuIcon
              style={{
                color: "white",
              }}
            />
          </Button>
          <Drawer
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

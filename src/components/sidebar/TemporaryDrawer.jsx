import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { Sidebar__menu__items } from "../../helpers/All__mapping";


import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {Sidebar__menu__items.map((text, index) => (
          <Link
            to={
              text.menu__title === "Create Flow" &&
              !localStorage.getItem("createFlowInMenuBarDisbled")
                ? "/user__configuration"
                : text.route__path
            }
          >
            <ListItem
              key={text.menu__title}
              disablePadding
              onClick={()=>(text.menu__title === "Create Flow" &&
              !localStorage.getItem("createFlowInMenuBarDisbled")) && toast('You need to set up user config first')}
              // disabled={
              //   text.menu__title === "Create Flow" &&
              //   !localStorage.getItem("createFlowInMenuBarDisbled")
              //     ? true
              //     : false
              // }
            >
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text.menu__title} />
              </ListItemButton>
            </ListItem>
          </Link>
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
            // anchor={anchor}
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

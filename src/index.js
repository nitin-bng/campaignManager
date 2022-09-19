import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter } from "react-router-dom";
import { StateProvider } from "../src/store/store";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ErrorProvider } from "./store/errorContext";
import { ThemeProvider } from "@material-ui/core/styles";
import Theme from "../src/components/Theme";
import { CommonProvider } from "./helpers/CommonContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {/* <BrowserRouter> */}
    <ThemeProvider theme={Theme}>
      <CommonProvider>
        <StateProvider>
          <ErrorProvider>
            <App />
          </ErrorProvider>
        </StateProvider>
      </CommonProvider>
    </ThemeProvider>
    {/* </BrowserRouter> */}
  </>
);

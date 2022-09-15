import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter } from 'react-router-dom';
import { StateProvider } from "../src/store/store";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ErrorProvider } from "./store/errorContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <BrowserRouter>
      <StateProvider>
        <ErrorProvider>
              <App />
        </ErrorProvider>
    </StateProvider>
    </BrowserRouter>
  </>
);
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter } from 'react-router-dom';
import { StateProvider } from "../src/store/store";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
  
    <BrowserRouter>
    <StateProvider>
            <App />
        </StateProvider>

    </BrowserRouter>
  </>
);
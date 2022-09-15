import React from "react";

import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/homepage/Home";
import CreateFlow from "./pages/create__flow/CreateFlow";
import UserConfig from "./pages/user__config/UserConfig";
import { CommonProvider } from "./helpers/CommonContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from '@material-ui/core/styles';
import Theme from '../src/components/Theme'

const App = () => {
  return (
    <>
      <div className="app">
      <ThemeProvider theme={Theme}>
        <CommonProvider>
          <ToastContainer />
          <div className="app__container">
            <Routes>
              <Route path="/campmngr" element={<Login />} />
              <Route path="/campmngr/signup" element={<Signup />} />
              <Route path="/campmngr/forgotpassword" element={<ForgotPassword />} />
              <Route path="/campmngr/verifyotp" element={<VerifyOtp />} />
              <Route path="/campmngr/home" element={<Home />} />
              <Route path="/campmngr/create__flow" element={<CreateFlow />} />
              <Route path="/campmngr/user__configuration" element={<UserConfig />} />
            </Routes>
          </div>
        </CommonProvider>
        </ThemeProvider>
      </div>
    </>
  );
};

export default App;

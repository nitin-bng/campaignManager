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


const App = () => {
  return (
    <>
      <div className="app">
        <CommonProvider>
          <ToastContainer />
          <div className="app__container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/verifyotp" element={<VerifyOtp />} />
              <Route path="/home" element={<Home />} />
              <Route path="/create__flow" element={<CreateFlow />} />
              <Route path="/user__configuration" element={<UserConfig />} />
            </Routes>
          </div>
        </CommonProvider>
      </div>
    </>
  );
};

export default App;

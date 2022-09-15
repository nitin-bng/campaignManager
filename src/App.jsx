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
import RequireAuth from "./components/auth/requireAuth";
import RequireNoAuth from "./components/auth/requireNoAuth";


const App = () => {
  return (
    <>
      <div className="app">
        <CommonProvider>
          <ToastContainer />
          <div className="app__container">
            <Routes>
              <Route path="/campmngr" element={<RequireNoAuth><Login /></RequireNoAuth>} />
              <Route path="/campmngr/signup" element={<RequireNoAuth><Signup /></RequireNoAuth>} />
              <Route path="/campmngr/forgotpassword" element={<RequireNoAuth><ForgotPassword /></RequireNoAuth>} />
              <Route path="/campmngr/verifyotp" element={<RequireNoAuth><VerifyOtp /></RequireNoAuth>} />
              <Route path="/campmngr/home" element={<RequireAuth><Home /></RequireAuth>} />
              <Route path="/campmngr/create__flow" element={<RequireAuth><CreateFlow /></RequireAuth>} />
              <Route path="/campmngr/user__configuration" element={<RequireAuth><UserConfig /></RequireAuth>} />
            </Routes>
          </div>
        </CommonProvider>
      </div>
    </>
  );
};

export default App;

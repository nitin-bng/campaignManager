import React from "react";

// import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import { ThemeProvider } from '@material-ui/core/styles';
import Theme from '../src/components/Theme'

const App = () => {
  return (
    <Router>
      <div className="app">
      {/* <ThemeProvider theme={Theme}>
        <CommonProvider> */}
          <ToastContainer />
          <div className="app__container">
            {/* <h1>hello guyssssss</h1> */}
            <Routes>
              <Route path="/campaign-manager/" element={<RequireNoAuth><Login /></RequireNoAuth>} />
              <Route path="/campaign-manager/signup" element={<RequireNoAuth><Signup /></RequireNoAuth>} />
              <Route path="/campaign-manager/forgotpassword" element={<RequireNoAuth><ForgotPassword /></RequireNoAuth>} />
              <Route path="/campaign-manager/verifyotp" element={<RequireNoAuth><VerifyOtp /></RequireNoAuth>} />
              <Route path="/campaign-manager/home" element={<RequireAuth><Home /></RequireAuth>} />
              <Route path="/campaign-manager/create__flow" element={<RequireAuth><CreateFlow /></RequireAuth>} />
              <Route path="/campaign-manager/user__configuration" element={<RequireAuth><UserConfig /></RequireAuth>} />
            </Routes>
          </div>
        {/* </CommonProvider>
        </ThemeProvider> */}
      </div>
    </Router>
  );
};

export default App;

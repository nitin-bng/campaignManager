import React from "react";

import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/homepage/Home";
import CreateFlow from "./pages/create__flow/CreateFlow";
import UserConfig from "./pages/user__config/UserConfig";
import { CommonProvider } from "./helpers/CommonContext";
import Login from "./pages/Login";

const App = () => {
  return (
    <>
      <div className="app">
        <CommonProvider>
          <div className="app__container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
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

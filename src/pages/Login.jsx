import React, { useState, useEffect, useRef } from "react";

import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import "./authentication.css";
import { useForm } from "react-hook-form";

import config from "../ApiConfig/Config";
import { toast } from "react-toastify";
// import style from 'styled-component'
const Login = () => {
  const Navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    // console.log(data.email);
    loginUser(data);
  };

  const loginUser = (data) => {
    data["type"] = "";
    fetch(config.server.path + config.server.port3 + config.api.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      res.json().then((res) => {
        localStorage.setItem("userType", res.userType);
        localStorage.setItem("userId", res.id);

        getUserDetails(res.id);

        if (res.status === "unsuccessful") {
          toast("Wrong credentials!");
        }
      });
    });
  };

  const getUserDetails = (id) => {
    fetch(
      config.server.path +
        config.server.port3 +
        "/" +
        localStorage.getItem("userType") +
        "/" +
        id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      res.json().then((res) => {
        console.log(res);
        console.log(res.user);
        console.log(res.user.country);
        localStorage.setItem("userCountry", res.user.country);
        localStorage.setItem("operatorName", res.user.operatorName);
        sessionStorage.setItem("userName", res.user.name);
        Navigate("/campmngr/home");
      });
    });
  };

  return (
    <>
      <div className="signin">
        <div className="overlay"></div>
        <div className="signin__container">
          <div className="signin__form">
            <div className="icon__container">
              <div className="icon__class">
                <PersonIcon />
              </div>
              <div className="text">Sign in</div>
            </div>

            <div className="mailid__and__password__conatiner signin__mailid__and__password__conatiner">
              <div className="login__email__field">
                <TextField
                  id="Email"
                  type="email"
                  variant="outlined"
                  label="Enter Email"
                  fullWidth
                  required
                  error={!!errors?.Email}
                  helperText={errors?.Email ? errors.Email.message : ""}
                  {...register("email", {
                    required: "Requird field",
                    pattern: {
                      value:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Invalid Email",
                    },
                  })}
                />
              </div>
              <div className="password">
                <TextField
                  id="password"
                  type="password"
                  variant="outlined"
                  label="Enter password"
                  fullWidth
                  error={errors.password}
                  {...register("password", {
                    required: "This field is required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*['@','#','$','&','%']).{8,16}$/,
                      message:
                        "Password should consist of atleast one number, one uppercase ,one lowercase and one special character",
                    },
                    minLength: { value: 8, message: "Atleast 8 character" },
                    maxLength: {
                      value: 16,
                      message: "Atmost 16 character",
                    },
                  })}
                  helperText={errors.password ? errors.password.message : ""}
                />
              </div>
            </div>

            <div className="terms__and__button__container">
              <div className="terms__checkbox">
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkboxicon={<CheckBoxIcon />}
                      name="checkedI"
                    />
                  }
                  label="Remember me"
                />
              </div>
              <div className="create__account__button button">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  Log in
                </Button>
              </div>
            </div>

            <div className="authentication__links">
              <p className="links">
                <Link to="/campmngr/forgotpassword">Forgot Password ?</Link>
                <Link to="/campmngr/signup">Do not have an account ?</Link>
                {/* <p>OR</p>
                <Link to="/home">Use as guest</Link> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

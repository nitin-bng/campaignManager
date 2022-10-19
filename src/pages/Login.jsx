import React from "react";

import {
  TextField,
  Button,

} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";

import "./authentication.css";
import { useForm } from "react-hook-form";

import config from "../ApiConfig/Config";
import { toast } from "react-toastify";
const Login = () => {
  const Navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    loginUser(data);
  };

  const loginUser = (data) => {
    data["type"] = "";
    fetch(config.server.path + config.server.port3 + config.api.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify(data)
    }).then((res)=>{
        res.json()
           .then((res)=>{
            if(res.status === 'successful'){
              
              localStorage.setItem("userType", res.userType)
              localStorage.setItem("userId", res.id)
              getUserDetails(res.id)
            }
            else if(res.status === 'unsuccessful'){
              toast(res.reason)
              if(res.reason === 'Your account is not verified')
                localStorage.setItem("phoneNumber", res.phoneNumber)
                Navigate('/Campaign-manager/verifyotp')
            }
           })
    })
    .catch((e)=>
      console.error(e)
    )
  }

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
        if(res.userConfigurations.assignChannel >= 1){
          localStorage.setItem("createFlowInMenuBarDisbled", true);
        }
        localStorage.setItem("userCountry", res.user.country);
        localStorage.setItem("operatorName", res.user.operatorName);
        localStorage.setItem("operatorDisplayName", res.user.operatorDisplayName);
        localStorage.setItem("operatorCountry", res.user.operatorCountry);
        sessionStorage.setItem("userName", res.user.name);

        Navigate("/campaign-manager/home");
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
                <Link to="/campaign-manager/forgotpassword">Forgot Password ?</Link>
                <Link to="/campaign-manager/signup">Do not have an account ?</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

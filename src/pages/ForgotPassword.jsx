import React, { useState } from "react";

import "./authentication.css";

import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@material-ui/core";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import "./authentication.css";
import { useForm } from "react-hook-form";
import MuiPhoneNumber from "material-ui-phone-number";
import axios from "axios";
import config from "../ApiConfig/Config";
import { ProcessNumberFunction } from "../helpers/Utils";
import PhoneInput from 'react-phone-input-2'
import { toast } from "react-toastify";

const ForgotPassword = () => {
  // const [phone, setPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    data["phone"] = phoneNumber;
    // console.log(data);

    ProcessNumberFunction(phoneNumber);

    // fetch(config.server.path + config.server.port2 + config.api.getFeature)
    //   .then((result) => result.json())
    //   .then((res) => {
    //     console.log(res);
    //     // console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log("the error is::", error);
    //   });
    console.log("func ran");
     axios
      .get(
        config.server.path + config.server.port3 + config.api.forgotpassword,
        {
          params: { phoneNumber: phoneNumber },
        }
      )
      .then((response) => {
        toast(response.data.reason)
        console.log("response", response);
        return response;
      })
      .catch((error) => {
        toast(error.response.data.reason)
        console.log("error", error);
        return error;
      });
  };

  // const handlePhnChange = (e) => {
  //   setPhone(e.target.value);
  //   // console.log(e.target.value);
  // };

  return (
    <>
      <div className="signin forgot__password">
        <div className="signin__container forgot__password__container">
          <div className="forgotpassword__form signin__form">
            <div className="icon__container">
              <div className="icon__class">
                <PersonIcon />
              </div>
              <div className="text">Forgot Password</div>
            </div>

            <div className="mailid__and__password__conatiner signin__mailid__and__password__conatiner">
              <div className="ph-no__container">
 
                <Box
                  component="form"
                  style={{ width: "100%", display:"flex", justifyContent:"center"}}
                  noValidate
                  autoComplete="off"
                  >
                   <PhoneInput
                  style={{ width:"80%", height:"3rem", outline:"none"}}
                    id="phonenumber"
                    country={'in'}
                    value={phoneNumber}
                    onChange={(value, country) => {
                      // setPhone(e)
                      setPhoneNumber(value);
                      // setError({ ...error, phoneError: "" });
                      // console.log("values::", value )
                      // console.log("country ====>", country);
                      setCountryCode(country.countryCode)
                      setCountryName(country.name)

                    }}
                    />
                </Box>
              </div>
            </div>

            <div className="terms__and__button__container">
              <div className="create__account__button button">
                <Link to="/campmngr/verifyotp">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Send Otp
                  </Button>
                </Link>
              </div>
            </div>

            <div className="authentication__links__signup">
              <p className="links">
                <Link to="/campmngr">Already have an account ?</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

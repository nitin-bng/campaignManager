import React, { useState, Component } from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  FormControl,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import MuiPhoneNumber from "material-ui-phone-number";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'

import "./authentication.css";
import { useEffect } from "react";
import axios from "axios";
import config from "../ApiConfig/Config";

import { MenuProps, useStyles, options } from "../../src/helpers/Utils";
import 'react-phone-input-2/lib/style.css'

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [operatorsFromAPI, setOperatorsFromAPI] = useState([]);
  const [operator, setOperator] = useState("");
  const [operatorId, setOperatorId] = useState([]);
  const [feature, setFeature] = useState([]);
  const [featuresFromAPI, setFeaturesFromAPI] = useState([]);
  const subfeatureInCategory = [];
  var arrayOfKeysOfFeatures = [];
  const [loader, setLoader] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [newFeatures, setNewFeatures] = useState([]);
  const [values, setValues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [response, setResponse] = useState("");
  const [reason, setReason] = useState("");

  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
// console.log(countryCode);

  // let history = useHistory();
  const navigate = useNavigate();
  const [error, setError] = useState({
    nameError: "",
    passwordError: "",
    emailError: "",
    phoneError: "",
    featuresError: "",
    checkError: "",
  });
  const latestfeatures = [
    { pId: 1, id: 4, subFeature: "Voice(ODB)" },
    { pId: 1, id: 5, subFeature: "Voice(Incoming)" },
    { pId: 2, id: 6, subFeature: "USSD(USSD)" },
    { pId: 3, id: 7, subFeature: "SMS(Incoming)" },
    { pId: 3, id: 8, subFeature: "SMS(Outgoing)" },
  ];
  // var hashmap = new Map();
  const handlePersonChange = (event) => {
    debugger;
    setError({ ...error, featuresError: "" });
    var data = [];
    const {
      target: { value },
    } = event;
    for (var i = 0; i < latestfeatures.length; i++) {
      var key = latestfeatures[i].subFeature;
      for (var j = 0; j < value.length; j++) {
        if (key == value[j]) {
          // console.log(true);
          data.push(latestfeatures[i].id);
          data.push(latestfeatures[i].pId);
        }
      }
    }
    setValues(data);
    setNewFeatures(typeof value === "string" ? value.split(",") : value);
  };
  // console.log(hashmap);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const featuresWithSubfeatuersObj = [];

  useEffect(() => {
    getFeatures();
    getOperator();
  }, []);

  const onSubmit = async (data) => {
    data["phoneNumber"] = phoneNumber;
    data["operatorId"] = operator;
    data["companyName"] = data.companyName;
    data["companyAddress"] = companyAddress;
    data["name"] = data.firstName + " " + data.lastName;
    data["countryCode"] = countryCode;
    data["country"] = countryName
    // console.log("data=====>>>", data);
    let uniqueArray = [...new Set(values)];

    setLoader(true);
    // setOpenModal(true);
    fetch(config.server.path + config.server.port3 + config.api.signUp, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: data, features: uniqueArray }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "successful") {
          localStorage.setItem("phoneNumber", JSON.stringify(phoneNumber));
          setResponse(result.status);
          setReason(result.reason);
          setLoader(false);
          setOpenModal(true);
        } else {
          setResponse(result.status);
          setReason(result.reason);
          setLoader(false);
          setOpenModal(true);
        }
      })
      .catch((error) => {
        setLoader(false);
        // console.log("the error is::", error);
      });

  };



  const getFeatures = () => {
    fetch(config.server.path + config.server.port3 + config.api.getFeature)
      .then((result) => result.json())
      .then((res) => {
        setFeaturesFromAPI(res);
        // console.log(res);
      })
      .catch((error) => {
        // console.log("the error is::", error);
      });
  };

  const getOperator = () => {
    fetch(config.server.path + config.server.port3 + config.api.setOperator)
      .then((result) => result.json())
      .then((res) => {
        setOperatorsFromAPI(res);
        // console.log(res);
        // console.log(operatorsFromAPI);
        // console.log(res.dispalyName);
      })
      .catch((error) => {
        // console.log("the error is::", error);
      });
  };

  const handleModal = () => {
    setOpenModal(false);
    if (response === "successful") {
      navigate("/verifyotp");
      // state: { detail: 'true' }
    } else if (response === "unsuccessful") {
      navigate("/");
    } else {
      navigate("/forgotpassword");
    }
  };
  return (
    <>
      <div className="signup">
        <div className="overlay"></div>
        <div className="signup__container">
          <div className="signup__form">
            <div className="icon__container">
              <div className="icon__class">
                <PersonAddIcon fontsize="large" />
              </div>
              <div className="text">Sign up</div>
            </div>

            <div className="name__input__container">
              <div className="firstname">
                <TextField
                  id="firstname"
                  type="text"
                  variant="outlined"
                  label="Enter first name"
                  fullWidth
                  required
                  error={errors.firstName}
                  {...register("firstName", {
                    required: "This field is required",
                    minLength: { value: 3, message: "Atleast 3 character" },
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message: "Invalid Name",
                    },
                  })}
                  helperText={
                    errors.firstName ? errors.firstName.message : null
                  }
                />
              </div>
              <div className="lastname">
                <TextField
                  id="lastname"
                  type="text"
                  variant="outlined"
                  label="Enter last name"
                  fullWidth
                  required
                  error={errors.lastName}
                  {...register("lastName", {
                    required: "This field is required",
                    minLength: { value: 3, message: "Atleast 3 character" },
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message: "Invalid Name",
                    },
                  })}
                  helperText={errors.lastName ? errors.lastName.message : ""}
                />
              </div>
              <div className="company__name">
                <TextField
                  id="companyName"
                  type="text"
                  variant="outlined"
                  label="Enter company's name"
                  fullWidth
                  required
                  error={errors.companyName}
                  {...register("companyName", {
                    required: "This field is required",
                    minLength: { value: 3, message: "Atleast 3 character" },
                    pattern: {
                      value: /^[A-Za-z0-9]*$/i,
                      message: "Invalid Name",
                    },
                  })}
                  helperText={
                    errors.companyName ? errors.companyName.message : ""
                  }
                />
              </div>
            </div>

            <div className="userename__ph-no__email__password__container">
              <div className="username__phone__container">
                <div className="username__container">
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Operator
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={operator}
                        label="Operator"
                        onChange={(e) => {
                          operatorsFromAPI.forEach((val) => {
                            setOperatorId(val.id);
                            // console.log(val);
                            // console.log(operatorId);
                          });
                          setOperator(e.target.value);
                        }}
                      >
                        {operatorsFromAPI.map((item) => (
                          <MenuItem value={item.id}>
                            {item.displayName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <div className="ph-no__container">

                  <PhoneInput
                  style={{ width:"100%", height:"100%", outline:"none"}}
                    id="phonenumber"
                    country={'in'}
                    value={phoneNumber}
                    onChange={(value, country) => {
                      // setPhone(e)
                      setPhoneNumber(value);
                      setError({ ...error, phoneError: "" });
                      // console.log("values::", value )
                      // console.log("country ====>", country);
                      setCountryCode(country.countryCode)
                      setCountryName(country.name)

                    }}
                    />
                    {error.phoneError &&
                      <p className='validation'>{error.phoneError}</p>}
                  {error.phoneError && (
                    <p className="validation">{error.phoneError}</p>
                  )}
                </div>
              </div>
              <div className="email__password__conatiner">
                <div className="email__feature__container">
                  <div className="email">
                    <TextField
                      id="email"
                      type="email"
                      variant="outlined"
                      error={!!errors?.email}
                      helperText={errors?.email ? errors.email.message : ""}
                      label="Enter Email"
                      fullWidth
                      required
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
                  <div className="feature">
                    <FormControl style={{ width: "100%" }} fullwidth>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={newFeatures}
                        name="features"
                        onChange={handlePersonChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {latestfeatures.map((features) => (
                          <MenuItem
                            key={features.pId}
                            value={features.subFeature}
                          >
                            <Checkbox
                              checked={
                                newFeatures.indexOf(features.subFeature) > -1
                              }
                            />
                            <ListItemText primary={features.subFeature} />
                          </MenuItem>
                        ))}
                      </Select>
                      {error.featuresError && (
                        <p className="validation">{error.featuresError}</p>
                      )}
                    </FormControl>
                  </div>
                </div>
                <div className="password__confirm-password__container">
                  <div className="signup__password">
                    <TextField
                      id="password"
                      type="password"
                      variant="outlined"
                      label="Enter password"
                      fullWidth
                      required
                      error={errors.password}
                      {...register("password", {
                        required: "This field is required",
                        minLength: { value: 8, message: "Atleast 8 character" },
                        maxLength: {
                          value: 16,
                          message: "Atmost 16 character",
                        },
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*['@','#','$','&','%']).{8,15}$/,
                          message:
                            "Password should consist of atleast one number, one uppercase ,one lowercase and one special character",
                        },
                      })}
                      helperText={
                        errors.password ? errors.password.message : ""
                      }
                    />
                  </div>
                  <div className="confirm__password">
                    <TextField
                      id="confirm__password"
                      type="password"
                      required
                      variant="outlined"
                      label="Confirm password"
                      fullWidth
                      error={errors.confirm__password}
                      {...register("confirm__password", {
                        required: true,
                        validate: (val) => {
                          if (watch("password") !== val) {
                            return "Your passwords do no match";
                          }
                        },
                      })}
                      helperText={
                        errors.confirm__password
                          ? errors.confirm__password.message
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="address__container">
              <TextField
                id="companyAddress"
                type="text"
                variant="outlined"
                value={companyAddress}
                onChange={(e) => {
                  setCompanyAddress(e.target.value);
                }}
                label="Enter company address"
                fullWidth
              />
            </div>

            <div className="terms__and__button__container__signup">
              <div className="terms__checkbox">
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkboxicon={<CheckBoxIcon />}
                      name="checkedI"
                    />
                  }
                  label="I agree terms and conditions"
                />
              </div>
              <div className="create__account__button button">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit(onSubmit)}
                >
                  {loader ? <Loader /> : "Create Account"}
                </Button>
              </div>
            </div>

            <div className="authentication__links__signup">
              <p className="links">
                <Link to="/">Already have an account ?</Link>
                <p>OR</p>
                <Link to="/home">Use as guest</Link>
              </p>
            </div>
          </div>
          {openModal && (
            <div className="bg-modal">
              <div className="modal-content">
                <h3 className="title">{reason}</h3>
                <button className="closeBtn" onClick={(e) => handleModal(e)}>
                  Ok
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Signup;

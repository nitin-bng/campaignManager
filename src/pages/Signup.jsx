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
} from "@material-ui/core";
import { Link } from "react-router-dom";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import MuiPhoneNumber from "material-ui-phone-number";
import AddressInput from "material-ui-address-input";
import { useForm } from "react-hook-form";

import "./authentication.css";
import { useProgressStyles, useStatStyles } from "@chakra-ui/react";

// address class component srart
export class ControlledAddressInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      addresses: [],
    };
  }

  handleAddAddress = (address) => {
    this.setState({
      addresses: [...this.state.addresses, address],
    });
  };

  handleChangeAddress = (addressIndex) => {
    this.setState({
      address: addressIndex,
    });
  };

  render() {
    return (
      <AddressInput
        className="ph-no__input"
        onAdd={this.handleAddAddress}
        onChange={this.handleChangeAddress}
        value={this.state.address}
        allAddresses={this.state.addresses}
      />
    );
  }
}
// address class component ends

const Signup = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    console.log("hello");
    console.log(date);
    console.log(isValidDate());
  };
  const [religion, setreligion] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState(false);


  const handlePhnChange = (value) => {
    setPhone(value);
  };

  const isValidDate = () => {
     debugger
     if(date < new Date().toLocaleDateString("en-CA")){
      setDateError(false);
      console.log("If")
    }
    else{
      setDateError(true);
      console.log("else")
     }
    //  return date < new Date().toLocaleDateString("en-CA") ?true:false;
     debugger
      
  };

  const [operator, setOperator] = React.useState('');

  const handleOperatorChange = (event) => {
    setOperator(event.target.value);
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
                  helperText={errors.firstName ? errors.firstName.message : ""}
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
              <div className="father__name">
                <TextField
                  id="father__name"
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
                      value: /^[A-Za-z]+$/i,
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
                <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Operator</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={operator}
          label="Operator"
          onChange={handleOperatorChange}
        >
          <MenuItem value={10}>some dummy data</MenuItem>
        
        </Select>
      </FormControl>
                </div>
                <div className="ph-no__container">
                  <MuiPhoneNumber
                    defaultCountry={"in"}
                    onChange={handlePhnChange}
                    value={phone}
                    required
                    error={errors.phone}
                    {...register("phone", {
                      required: "This field is required",
                      minLength: { value: 10, message: "Invlaid Number" },
                      pattern: {
                        value: /^[0-9]+$/i,
                        message: "Phone should consist of number",
                      },
                    })}
                    helperText={errors.phone ? errors.phone.message : ""}
                  />
                </div>
              </div>
              <div className="email__password__conatiner">
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
              <ControlledAddressInput />
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
                  Create Account
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
        </div>
      </div>
    </>
  );
};

export default Signup;
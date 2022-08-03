import React, { useEffect, useState } from "react";

import OtpInput from "react-otp-input";
// import OTPInput, { ResendOTP } from "otp-input-react";
// import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import "./styles.css";
import config from "../ApiConfig/Config";
import { Link } from "react-router-dom";
import Loader from "./Loader";
// import { useHistory } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  grid: {
    backgroundColor: "grey",
    height: "50vh",
    textAlign: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function VerifyOtp(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [otpCode, setOtpCode] = useState("");
  const [loader, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [response, setResponse] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const [otpState, setOtpState] = useState({ otp: '' })
  // let history = useHistory();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("navigate", navigate);
  console.log("props", props);
  useEffect(() => {
    console.log(props);
    localStorage.getItem("phoneNumber");
    if (navigate != undefined && navigate.location !== undefined) {
      // if (props.location.state.detail == "mobile_no_not_verified") {
      getOtp();
      // }
    }
  }, []);
  const getOtp = () => {
    var phone = localStorage.getItem("phoneNumber");
    fetch(
      "http://34.214.61.86:8085/user/sendotp?phoneNumber=" + JSON.parse(phone)
    )
      .then((result) => result.json())
      .then((res) => {
        if (res.status === "successful") {
        } else {
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("the error is::", error);
      });
  };
  const handleSubmit = (e) => {
    // e.preventDefault();
    if (otpState === "") {
      setError("OTP is required");
      console.log("otp bharoooo");
      return;
    }
    setLoader(true);
    fetch(
      "http://34.214.61.86:8085/user/verify?phoneNumber=" +
        JSON.parse(localStorage.getItem("phoneNumber")) +
        "&otp=" +
        otpState.otp
    )
      .then((result) => result.json())
      .then((res) => {
        if (res.status === "successful") {
          setLoader(false);
          setResponse(res.status);
          setReason(res.reason);
          console.log("Response is::", res);
        } else {
          setResponse(res.status);
          setReason(res.reason);
          setLoader(false);
        }
        setOpenModal(true);
      })
      .catch((error) => {
        setLoader(false);
        console.log("the error is::", error);
      });
  };
  const handleModal = () => {
    setOpenModal(false);
    if (response === "successful") {
      // history.push({
      //     pathname: '/',
      //     state: { detail: 'true' }
      // });
      navigate("/");
    } else {
      // history.push({
      //     pathname: '/otp',
      //     state: { detail: 'true' }
      // });
      navigate("/verifyotp");
    }
  };

  const handleOTPChange = (otp) => {
      setOtpState({otp})
  }
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid
          container
          style={{ backgroundColor: "white" }}
          className={classes.grid}
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item container justify="center">
            <Grid item container alignItems="center" direction="column">
              <Grid item>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
              </Grid>
              <Grid item>
                <Typography component="h1" variant="h5">
                  Verification Code
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Paper elevation={0}>
              <Typography variant="h6">
                Please enter the verification code sent to your mobile
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Grid item spacing={3} justify="center">
              <OtpInput
                value={otpState.otp}
                onChange={handleOTPChange}
                numInputs={4}
                inputStyle={{
                  width: "3rem",
                  height: "3rem",
                  margin: "0 1rem",
                  fontSize: "2rem",
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.3)",
                }}
                separator={<span>-</span>}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                {loader ? <Loader /> : "verify"}
              </Button>
              <label className="resendOtp" htmlFor="phoneNumber" style={{width:"90%", textTransform:"lowercase",textDecoration:"underline", textAlign:"right", cursor:"pointer", marginBottom:"0px"}} onClick={getOtp}>resend otp</label>

            </Grid>
          </Grid>
        </Grid>
      </div>
      {openModal && (
        <div className="bg-modal">
          <div className="modal-content">
            <h3>{reason}</h3>
            <button className="closeBtn" onClick={(e) => handleModal(e)}>
              Ok
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

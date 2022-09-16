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
import "./authentication.css";
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

  const [otpState, setOtpState] = useState({ otp: "" });
  // let history = useHistory();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("navigate", navigate);
  // console.log("props", props);
  useEffect(() => {
    // console.log(props);
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
      "http://34.214.61.86:8087/user/sendotp?phoneNumber=" + JSON.parse(phone)
    )
      .then((result) => result.json())
      .then((res) => {
        if (res.status === "successful") {
        } else {
        }
      })
      .catch((error) => {
        setLoader(false);
        // console.log("the error is::", error);
      });
  };
  const handleSubmit = (e) => {
    // e.preventDefault();
    if (otpState === "") {
      setError("OTP is required");
      // console.log("otp bharoooo");
      return;
    }
    setLoader(true);
    fetch(
      "http://34.214.61.86:8087/user/verify?phoneNumber=" +
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
          // console.log("Response is::", res);
        } else {
          setResponse(res.status);
          setReason(res.reason);
          setLoader(false);
        }
        setOpenModal(true);
      })
      .catch((error) => {
        setLoader(false);
        // console.log("the error is::", error);
      });
  };
  const handleModal = () => {
    setOpenModal(false);
    if (response === "successful") {
      // history.push({
      //     pathname: '/',
      //     state: { detail: 'true' }
      // });
      navigate("/campmngr");
    } else {
      // history.push({
      //     pathname: '/otp',
      //     state: { detail: 'true' }
      // });
      navigate("/campmngr/verifyotp");
    }
  };

  const handleOTPChange = (otp) => {
    setOtpState({ otp });
  };
  return (
    <Container
      component="main"
      maxWidth="sm"
      style={{
        // border: "2px solid red",
        width: "100vw",
        height: "100vh",
        // background: "red",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding:"0"
      }}
    >
      <CssBaseline />
      <div style={{border: "2px solid black"}}>
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
                <Avatar
                  style={{ background: "#374151" }}
                  className={classes.avatar}
                >
                  <LockOutlinedIcon style={{ background: "#374151" }} />
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
            <Grid item >
              <Button
                style={{
                  backgroundColor: " #374151",
                  color: "white",
                  width:"7rem",
                  textTransform: "uppercase",
                  textShadow: "1px 1px 2px black",
                  fontWeight: "700",
                  marginTop:"1rem",
                  // margin:"auto"
                }}
                type="submit"
                // fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                {loader ? <Loader /> : "verify"}
              </Button>
              <br />
              <Button
                
                style={{
                  backgroundColor: " #374151",
                  color: "white",
                  width:"10rem",
                  textTransform: "uppercase",
                  textShadow: "1px 1px 2px black",
                  fontWeight: "700",
                  marginTop:"1rem",
                  // margin:"auto"
                }}
                type="submit"
                // fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={getOtp}
              >
                resend otp
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {openModal && (
        <div
          className="bg-modal"
          style={{ position: "fixed", left: "0", top: "0" }}
        >
          <div className="modal-content">
            <h3>{reason}</h3>
            <button
              style={{
                padding: ".5rem 1rem",
                border: "none",
                outline: "none",
                backgroundColor: " #374151",
                color: "white",
                textTransform: "uppercase",
                textShadow: "1px 1px 2px black",
                width: "10%",
                // margin: "auto",
                marginBottom: "1rem",
                transition: "all 0.5s",
                fontWeight: "700",
              }}
              className="closeBtn"
              onClick={(e) => handleModal(e)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

import React, { useEffect, useState } from "react";

import OtpInput from "react-otp-input";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Loader from "./Loader";
import { useNavigate, useLocation } from "react-router-dom";
import config from "../ApiConfig/Config"
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

  const [loader, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [response, setResponse] = useState("");
  const [reason, setReason] = useState("");
  const [otpState, setOtpState] = useState({ otp: "" });
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    localStorage.getItem("phoneNumber");
    if (navigate != undefined && navigate.location !== undefined) {
      getOtp();
    }
  }, []);
  const getOtp = () => {
    var phone = localStorage.getItem("phoneNumber");
    fetch(
      config.server.path + config.server.port3 + "/user/sendotp?phoneNumber=" + JSON.parse(phone)
    )
      .then((result) => result.json())
      .then((res) => {
        if (res.status === "successful") {
        } else {
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };
  const handleSubmit = (e) => {
    setLoader(true);
    fetch(
      config.server.path + config.server.port3 +"/user/verify?phoneNumber=" +
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
        } else {
          setResponse(res.status);
          setReason(res.reason);
          setLoader(false);
        }
        setOpenModal(true);
      })
      .catch((error) => {
        setLoader(false);
      });
  };
  const handleModal = () => {
    setOpenModal(false);
    if (response === "successful") {
      navigate("/campaign-manager/");
    } else {
      navigate("/campaign-manager/verifyotp");
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
        width: "100vw",
        height: "100vh",
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
                }}
                type="submit"
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
                }}
                type="submit"
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

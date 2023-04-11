import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import Wrapper from "../Components/Wrapper";
import { resetPassword } from "../Redux/actions/authAction";
import { DASHBOARD } from "../Constants/routesName";

const useStyles = makeStyles({
  noteText: {
    marginTop: 50,
    marginBottom: 50,
    textTransform: "capitalize"
  },
  paper: {
    padding: 20
  }
});

const ChangePasswordScreen = props => {
  const classes = useStyles();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      const error = await resetPassword(confirmPassword);
      if (error) {
        alert(error);
        setConfirmPassword("");
        return;
      }
      props.history.push(DASHBOARD);
    } else {
      alert("passowrd not match!");
      setConfirmPassword("");
    }
  };

  return (
    <Wrapper>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        // alignSelf="center"
        p={5}
        bgcolor="background.paper"
      >
        <Paper className={classes.paper} elevation={5}>
          <div
            style={{
              // width: 500,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: 100
            }}
          >
            <img
              src={require("../assets/logo.png")}
              alt="plai-logo"
              style={{
                width: 100,
                // height: 100,
                padding: 20
              }}
            />
          </div>
          <Typography
            variant="h4"
            className={classes.noteText}
            align="center"
            color="textSecondary"
          >
            Reset your password
          </Typography>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              autoFocus
              margin="dense"
              id="newPassword"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
            />
            <TextField
              margin="dense"
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
            />
            <Button
              fullWidth
              color="primary"
              variant="contained"
              style={{ marginTop: 60 }}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </div>
        </Paper>
      </Box>
    </Wrapper>
  );
};

export default ChangePasswordScreen;

import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";
import SmsIcon from "@material-ui/icons/Sms";
import Background from "./assets/images/background.png";

const useStyles = makeStyles({
  backgroundTint: {
    position: "absolute",
    height: "100vh",
    width: "calc(100vw * 5 /12)",
    background: "linear-gradient(#3A8DFF, #86B9FF);",
    zIndex: "100",
    opacity: 0.8532,
  },
  backgroundImg: {
    height: "100vh",
    width: "calc(100vw * 5 /12)",
    backgroundImage: `url(${Background})`,
    backgroundSize: "cover",
  },
  backgroundTextContainer: {
    position: "absolute",
    height: "100vh",
    width: "calc(100vw * 5 /12)",
    zIndex: "200",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  chatBubble: {
    fontSize: 50,
  },
  backgroundText: {
    fontSize: "26px",
    fontFamily: "'Open Sans', sans-serif",
  },
  contents: {
    height: "100vh",
  },
  createContainer: {
    height: "5vh",
    padding: "30px 42px 0 0",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  createHelperText: {
    color: "#B0B0B0",
    fontSize: "14px",
    fontFamily: "'Open Sans'",
    marginRight: "25px",
  },
  authContainer: {
    height: "95vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  authContainerAlignment: {
    width: "60%",
  },
  authTitle: {
    fontFamily: "Open Sans",
    fontSize: "26px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "40px",
  },
  input: {
    marginBottom: "20px",
  },
  createButton: {
    padding: "20px 60px",
    boxShadow: "0px 2px 12px rgba(74, 106, 149, 0.2)",
    borderRadius: "5px",
  },
  submitBtnContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40px",
  },
  submitBtn: {
    borderRadius: "3px",
    padding: "20px 70px",
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "16px",
  },
});

const Signup = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container justify="center" direction="row">
      <Grid item md={5}>
        <section className={classes.backgroundImg}>
          <div className={classes.backgroundTint} />
          <div className={classes.backgroundTextContainer}>
            <SmsIcon className={classes.chatBubble} />
            {/* <img src={ChatBubble} alt="chat-bubble" className={classes.chatBubble} /> */}
            <Typography className={classes.backgroundText}>
              Converse with anyone with any language
            </Typography>
          </div>
        </section>
      </Grid>
      <Grid item md={7} className={classes.contents}>
        <Grid container item className={classes.createContainer}>
          <Typography className={classes.createHelperText}>
            Already have an account?
          </Typography>
          <Button
          color="primary"
            className={classes.createButton}
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </Grid>
        <Grid className={classes.authContainer}>
          <Grid className={classes.authContainerAlignment}>
            <Grid>
              <Typography className={classes.authTitle}>
                Create an account.
              </Typography>
            </Grid>
            <form onSubmit={handleRegister}>
              <Grid>
                <Grid>
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      className={classes.input}
                      aria-label="username"
                      label="Username"
                      name="username"
                      type="text"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl margin="normal" fullWidth>
                    <TextField
                      className={classes.input}
                      label="E-mail address"
                      aria-label="e-mail address"
                      type="email"
                      name="email"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl
                    error={!!formErrorMessage.confirmPassword}
                    margin="normal"
                    fullWidth
                  >
                    <TextField
                      className={classes.input}
                      aria-label="password"
                      label="Password"
                      type="password"
                      inputProps={{ minLength: 6 }}
                      name="password"
                      required
                    />
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl
                    error={!!formErrorMessage.confirmPassword}
                    margin="normal"
                    fullWidth
                  >
                    <TextField
                      label="Confirm Password"
                      aria-label="confirm password"
                      type="password"
                      inputProps={{ minLength: 6 }}
                      name="confirmPassword"
                      required
                    />
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid className={classes.submitBtnContainer}>
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    size="large"
                    className={classes.submitBtn}
                  >
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

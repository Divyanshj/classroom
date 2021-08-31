import React from "react";
import { Paper, Button, Typography } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import CallEndIcon from "@material-ui/icons/CallEnd";
import VideocamIcon from "@material-ui/icons/Videocam";
// import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import { makeStyles } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const moment = new Date();
const option1 = { day: "numeric", month: "short" };
const option2 = { weekday: "long" };
const today1 = moment.toLocaleDateString("en-US", option1);
const today2 = moment.toLocaleDateString("en-US", option2);

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: "30px",
    marginBottom: "15px"
  },
  paper: {
    backgroundColor: "#FFFFFF",
    paddingLeft: "23px",
    marginTop: "15px",
    paddingTop: "10px"
  },
  button: {
    padding: "15px",
    borderRadius: "100%",
    backgroundColor: "#B3B3B3",
    color: "#282828",
    marginTop: "30px"
  },
  button1: {
    padding: "15px",
    borderRadius: "100%",
    marginTop: "30px"
  },
  date: {
    textAlign: "center",
    color: "#B3B3B3",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.4rem"
  }
}));
function CallOption(props) {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h6" className={classes.date}>
        {today1},
      </Typography>
      <Typography variant="h6" className={classes.date}>
        {today2}
      </Typography>
      <Paper className={classes.paper} style={{ marginTop: "40px" }}>
        <div className={classes.root}>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={props.toggleCameraAudio}
            data-switch='audio'
            title="Toggle Audio"
          >
            {props.userVideoAudio.audio ? (
              <MicIcon fontSize="large" />
            ) : (
              <MicOffIcon fontSize="large" />
            )}
          </Button>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            className={classes.button}
            data-switch='video'
            onClick={props.toggleCameraAudio}
            title="Toggle Video"
          >
          {props.userVideoAudio.video ? (
              <VideocamIcon fontSize="large" />
            ) : (
              <VideocamOffIcon fontSize="large" />
            )}
          </Button>
          {
            props.leave ? (
              <Button
                size="large"
                variant="contained"
                color="primary"
                className={classes.button1}
                onClick={props.endCall}
                title="Leave Room"
              >
                <ExitToAppIcon fontSize="large" />
              </Button>
            ) : (
              <Button
                size="large"
                variant="contained"
                color="secondary"
                className={classes.button1}
                onClick={props.goToBack}
                title="Leave Video"
              >
                <CallEndIcon fontSize="large" />
              </Button>
            )
          }

          {/* <Button
            size="large"
            variant="contained"
            color="primary"
            className={classes.button1}
          >
            <ScreenShareIcon fontSize="large" />
          </Button> */}
        </div>
      </Paper>
    </div>
  );
}

export default CallOption;

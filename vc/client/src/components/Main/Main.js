import React, { useRef, useState, useEffect } from 'react';
import socket from '../../socket';
import { makeStyles } from "@material-ui/core";
import { Paper, Grid, Typography, Button} from "@material-ui/core";
import HomeImage from "./image1.svg";
import Heading from "./Heading"

const useStyles = makeStyles((theme) => ({
  body: {
    display: "block",
    paddingTop: "10px",
    backgroundColor: "#FFFFFF"
  },
  paper: {
    marginRight:"100px",
    marginLeft: "100px",
    background: "#e0e0e0",
    textAlign: "center"
  },
  mainTitle: {
    fontFamily: "'Ubuntu', sans-serif",
    color: "#B3B3B3",
    textAlign: "center",
    fontSize: "4rem",
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingLeft: "50px",
    paddingRight: "50px"
  },
  meetingStart: {
    padding: "10px",
    paddingLeft: "20px",
    paddingRight: "20px",
    borderRadius: "20px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#000000",
    fontSize: "2rem"
  },
  inputBox: {
    backgroundColor: "#404040",
    marginTop: "10px",
    borderRadius: "20px",
    paddingLeft: "20px",
    paddingTop: "8px",
    paddingBottom: "8px",
    color: "#B3B3B3",
    outline: "none"
  },
  start: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.1rem",
    borderRadius: "20px",
    textTransform: "none",
    marginTop: "20px",
    marginBottom: "20px"
  },
  label: {
    fontFamily: "'Ubuntu', sans-serif",
    color: "#B3B3B3",
    marginRight: "15px"
  }
}));


function Main(props) {
  const classes = useStyles();

  const roomRef = useRef();
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [inp, setInp] = React.useState(false);

  useEffect(() => {

    socket.on('errorUserExists', ({clients, userName, socketList}) => {
      let error = false;
      clients.forEach((client) => {
        if (socketList[client].userName === userName) {
          error = true;
        }
      });
      if (!error) {
        const roomName = roomRef.current.value;
        const userName = userRef.current.value;

        sessionStorage.setItem('user', userName);
        props.history.push(`/room/${roomName}`);
      } else {
        setErr(error);
        setErrMsg('User name already exist');
      }
    });
  }, [props.history]);

  function clickJoin() {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;

    if (!roomName || !userName) {
      setErr(true);
      setErrMsg('Enter Room Name or User Name');
    } else {
      socket.emit('checkUser', { roomId: roomName, userName });
    }
  }
  function setInput() {
    setInp(true);
  }


  return (
      <div className={classes.body}>
      <Heading meeting={false} />
      <Grid container spacing={1}>

        <Grid item xs={6}>
          <Paper
            className={classes.paper}
            style={{
              marginRight: "100px",
              marginLeft: "100p",
              backgroundColor: "#ffffff",
              paddingBottom: "10px"
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                display: "inline-flex",
                marginTop: "30px",
                borderRadius: "30px",
                marginBottom: "20px"
              }}
            >
              <Typography
                variant="body1"
                className={classes.meetingStart}
                noWrap
              >
                Start VideoCall !!
              </Typography>
            </div>
            <br />
            <Button
              size="large"
              className={classes.start}
              display="inline"
              color="primary"
              variant="contained"
              style={{ marginRight: "15px" }}
              onClick={setInput}
            >
              New Call
            </Button>
            <Button
              size="large"
              className={classes.start}
              display="inline"
              color="secondary"
              variant="contained"
              style={{ marginLeft: "15px" }}
              onClick={setInput}
            >
              Join Call
            </Button>
            {inp ? (
              <div>
                <span className={classes.label}> Name : </span>
                <input
                  className={classes.inputBox}
                  ref={userRef}
                  style={{marginLeft: "12px"}}
                />
                <br />
                <span className={classes.label}> RoomId : </span>
                <input
                  className={classes.inputBox}
                  ref={roomRef}
                />
                <br />
                <Button
                  size="large"
                  className={classes.start}
                  display="inline"
                  color="primary"
                  variant="contained"
                  style={{ marginRight: "15px" }}
                  onClick={clickJoin}
                >
                  Les Go !!
                </Button>
                {err ? (
                  <p>{errMsg}</p>):(
                    null)}
              </div>
            ) : (
              <div></div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>

  );
};

export default Main;

import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Paper, Typography } from "@material-ui/core";

import MessageIcon from "@material-ui/icons/Message";
import socket from '../../socket';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#282828",
    borderRadius: "50px",
    marginTop: "15px",
    paddingTop: "10px"
  },
  chatHeading: {
    backgroundColor: "#404040",
    padding: theme.spacing(1),
    textAlign: "center",
    borderRadius: "30px",
    marginTop: "15px",
    paddingBottom: "5px"
  },
  chatBox: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.4rem",
    color: "#B3B3B3",
    marginBottom: "10px",
    display: "inline-block"
  },
  icon: {
    color: "#B3B3B3",
    textAlign: "center",
    marginRight: "10px",
    verticalAlign: "middle"
  },
  messageBox: {
    backgroundColor: "#404040",
    padding: theme.spacing(2),
    borderRadius: "30px",
    marginTop: "20px",
    height: "400px",
    overflowY: "auto"
  },

  inputBox: {
    backgroundColor: "#282828",
    color: "#B3B3B3",
    borderRadius: "20px",
    padding: "15px",
    width: "320px",
    outline: "none",
    marginBottom: "15px"
  },
  sendBox: {
    marginTop: "30px",
    textAlign: "center"
  },
  message: {
    color: "#B3B3B3",
    backgroundColor: "#282828",
    display: "inline-block",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "20px"
  },
  title: {
    fontSize: "0.6rem",
    margin: 0,
    fontFamily: "'Ubuntu', sans-serif",
  },
  body: {
    margin: "1px",
    fontSize: "1rem",
    fontFamily: "'Montserrat', sans-serif"
  },
  sent: {
    textAlign: "right"
  },
  received: {
    textAlign: "left"
  }
}));

function ChatOption(props){
  const roomID = props.roomID;
  const currentUser = sessionStorage.getItem('user')
  const [msg, setMsg] = useState([])

  const messagesEndRef = useRef(null);
  const inputRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    socket.on('receiveMessage', ({ msg, sender }) => {
      setMsg((msgs) => [...msgs, { sender, msg }]);
    });
  }, [])

  function sendMessage(eve){
    if(eve.key === 'Enter'){
      const msg = eve.target.value

      if(msg){
        socket.emit('sendMessage',{ roomID, msg, sender: currentUser })
        inputRef.current.value = ''
      }
    }
  }
  return (
    <div>
      <Paper className={classes.chatHeading}>
        <MessageIcon fontSize="large" className={classes.icon} />
        <Typography variant="body1" className={classes.chatBox}>
          Messages
        </Typography>
      </Paper>
      <div className={classes.messageBox}>
      {
        msg && msg.map(({sender, msg}, IDx) => {
          if(sender === currentUser)
          {
            return (
              <div className={classes.sent} key={IDx}>
                <div className={classes.message}>
                  <p className={classes.title}>{sender}</p>
                  <p className={classes.body}>{msg}</p>
                </div>
              </div>
            )
          }
          else {
            return (
              <div className={classes.received}>
                <div className={classes.message}>
                  <p className={classes.title}>{sender}</p>
                  <p className={classes.body}>{msg}</p>
                </div>
              </div>
            )
          }
        })
      }
      <div style={{float:'left', clear: 'both'}} ref={messagesEndRef} />
      </div>
      <div className={classes.sendBox}>
        <input className={classes.inputBox} ref={inputRef} onKeyUp={sendMessage} placeholder="Press Enter to send Message"/>
      </div>
    </div>
  );
}

export default ChatOption;

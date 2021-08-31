import React from "react";
import {
  Button,
  Toolbar,
  Container
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontFamily: "'Pacifico', cursive",
    fontSize: "2.2rem",
    color: "#B3B3B3"
  },
  main: {
    backgroundColor: "#FFFFFF",
    borderRadius: "15px",
    padding: "10px"
  },
  button: {
    backgroundColor: "#404040",
    color: "#B3B3B3",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.1rem",
    borderRadius: "10px",
    textTransform: "none",
    marginLeft: "15px"
  },
  meetingID: {
    color: "#FFFFFFF",
    marginLeft: "14px",
    fontFamily: "'Ubuntu', sans-serif",
    fontSize: "1rem",
    marginRight: "14px"
  }
}));

function Heading(props) {
  const classes = useStyles();
  return (
    <Container>

    </Container>
  );
}

export default Heading;

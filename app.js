
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const dotenv=require('dotenv');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://Divyansh_Jain:"+process.env.PASS+"@cluster0.5aalj.mongodb.net/studentDB", {useNewUrlParser: true, useUnifiedTopology: true });


const studentSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
});

studentSchema.plugin(passportLocalMongoose);
studentSchema.plugin(findOrCreate);

const Student = new mongoose.model("Student", studentSchema);

passport.use(Student.createStrategy());

passport.serializeUser(function(student, done) {
  done(null, student.id);
});

passport.deserializeUser(function(id, done) {
  Student.findById(id, function(err, student) {
    done(err, student);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    Student.findOrCreate({ googleId: profile.id }, function (err, student) {
      return cb(err, student);
    });
  }
));

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/home",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {

    res.redirect("/home");
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/signup", function(req, res){
  res.render("signup");
});

app.get("/landing", function(req, res){
  res.render("landing");
});
//passport has isAuthenticate() through which we can check wether user is logged in or not
app.get("/home", function(req, res){
  if (req.isAuthenticated()){
  res.render("home");
} else {
  res.redirect("/landing");
}

});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/landing");
});

app.post("/signup", function(req, res){

  Student.register({username: req.body.username}, req.body.password, function(err, student){
    if (err) {
      console.log(err);
      res.redirect("/signup");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/home");
      });
    }
  });

});

app.post("/login", function(req, res){

  const student = new Student({
    username: req.body.username,
    password: req.body.password
  });

  req.login(student, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/home");
      });
    }
  });

});







app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000.");
});

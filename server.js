const express = require("express");
const app = express();
require("dotenv").config({ path: "./config/.env" });
const session = require('express-session');
const PORT = process.env.PORT || 3000;
//const mongoose = require('mongoose')
const MongoStore = require("connect-mongo");
const passport = require('passport')
const connectDB = require('./config/db');
const logger = require('morgan')
const methodOverride = require("method-override");
const flash = require("express-flash");


const path = require('path');


if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));}

  // Passport config
require("./config/passport")(passport);    
  
connectDB()
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))


//Use flash messages for errors, info, ect...
app.use(flash());


// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING}),
    cookie: {
    maxAge: 1000 * 60 * 6 // 6 hours
    },
  }));
  
  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());



  
  //Use forms for put / delete
app.use(methodOverride("_method"));

const mainRoutes = require("./routes/main");
const secondaryRoutes = require("./routes/secondary");
app.use("/", mainRoutes); 
app.use("/student", secondaryRoutes);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
  

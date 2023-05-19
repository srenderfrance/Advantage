const express = require('express');
const app = express();
require("dotenv").config({ path: "./config/.env" });
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const MongoStore = require("connect-mongo");
const passport = require('passport')
const connectDB = require('./config/db');
const logger = require('morgan')
const methodOverride = require("method-override");
const flash = require("express-flash");


const mainRoutes = require("./routes/main");
const secondaryRoutes = require("./routes/secondary");
const path = require('path');


if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));}

connectDB()
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use("/", mainRoutes); 
app.use("/student", secondaryRoutes);

//Use flash messages for errors, info, ect...
app.use(flash());


// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING}),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



//Use forms for put / delete
app.use(methodOverride("_method"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));


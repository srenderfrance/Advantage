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
const adminRoutes = require("./routes/admin")
const path = require('path');


if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));}

connectDB()

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

app.use("/", mainRoutes); 
app.use("/admin", adminRoutes);
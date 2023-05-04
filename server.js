const express = require('express');
const app = express();
require("dotenv").config({ path: "./config/.env" });

const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const MongoStore = require("connect-mongo");
const passport = require('passport')
const connectDB = require('./config/db');
const morgan = require('morgan')
const mainRoutes = require("./routes/main");
const path = require('path');
//const multer = require('multer')
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));}

connectDB()

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
/*app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/login.html'));
  });

  app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/register.html'));
  });
*/
  app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

app.use("/", mainRoutes); 
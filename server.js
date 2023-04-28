const express = require('express');
require("dotenv").config({ path: "./config/.env" });

const app = express();


const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose')
const MongoStore = require("connect-mongo");
const passport = require('passport')
const connectDB = require('./config/db');
const morgan = require('morgan')
const mainRoutes = require("./routes/main");
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
connectDB()
app.use(express.static(__dirname + 'public'));
app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
app.use("/", mainRoutes);
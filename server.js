const express = require('express')
require("dotenv").config({ path: "./config/.env" });
//const connectDB = require('.config/db')
const app = express()
const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
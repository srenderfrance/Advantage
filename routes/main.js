const express = require("express");
const router = express.Router();
const homeController = require('../controlers/home');


router.get("/", homeController.getIndex);



module.exports = router;
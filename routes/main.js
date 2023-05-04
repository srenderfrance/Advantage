const express = require("express");
const router = express.Router();
const homeController = require('../controlers/home');


//router.post("/", homeController.postLogin);
router.post("/register", homeController.postRegister)


module.exports = router;
const express = require("express");
const router = express.Router();
const homeController = require('../controlers/home');


router.get("/", homeController.getLogin);
router.get("/register", homeController.getRegister)


module.exports = router;
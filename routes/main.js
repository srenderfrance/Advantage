const express = require("express");
const router = express.Router();
const authController = require('../controlers/auth');


router.get("/", authController.getLogin);
router.post("/", authController.postLogin);
router.get("/register", authController.getRegister);
router.get("/adminLogin", authController.getAdminLogin);
router.post("/adminLogin", authController.postAdminLogin);

module.exports = router;
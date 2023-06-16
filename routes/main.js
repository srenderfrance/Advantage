const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');
const reviewController = require("../controllers/review");
const passport = require("passport")

router.get("/", authController.getLogin);
router.post("/", authController.postLogin);

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister, passport.authenticate("local"));

router.get("/adminLogin", authController.getAdminLogin);
//router.post("/adminLogin", authController.postAdminLogin);

router.get("/admin", authController.getAdmin);
//router.post('/admin', authController.postCohort);

router.get("/activities", authController.getActivities);




module.exports = router;
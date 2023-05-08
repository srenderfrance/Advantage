const express = require("express");
const router = express.Router();
const authController = require('../controlers/auth');


router.get("/", authController.getLogin);
//router.post("/", authController.postLogin);
router.get("/register", authController.getRegister);

router.get("/adminLogin", authController.getAdminLogin);
//router.post("/adminLogin", authController.postAdminLogin);

router.get("/admin", authController.getAdmin);
//router.post('/admin', authController.postCohort);

router.get("/activities", authController.getActivities);





module.exports = router;
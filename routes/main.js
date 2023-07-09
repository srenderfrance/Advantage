const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");
const adminController = require("../controllers/admin");

router.get("/", authController.getLogin);
router.post("/", authController.postLogin);

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/adminLogin", authController.getAdminLogin);
//router.post("/adminLogin", authController.postAdminLogin);

router.get("/admin", authController.getAdmin);
router.post("/newCohort", adminController.postCohort);

router.get("/activities", authController.getActivities);

router.post("/adminCohortName", adminController.getStudentList);
router.post("/adminUpdateCohortAdmin", adminController.updateCohortAdmin);
router.post("/removeCohortAdmin", adminController.removeCohortAdmin);

module.exports = router;
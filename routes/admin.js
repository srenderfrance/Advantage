const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");
const adminController = require("../controllers/admin");

router.get("/", authController.getCohortAdmin);
router.get("/schoolAdmin", authController.getSchoolAdmin)

router.post("/newCohort", adminController.postCohort);

router.post("/cohortName", adminController.getStudentList);
router.post("/updateCohortAdmin", adminController.updateCohortAdmin);
router.post("/removeCohortAdmin", adminController.removeCohortAdmin);

router.post("/activity", adminController.postActivity);






module.exports = router;
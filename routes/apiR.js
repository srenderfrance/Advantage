const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");
const adminController = require("../controllers/admin");
const apiContoller = require("../controllers/apiCon");


router.post("/admin", apiContoller.getStudents);
router.put("/admin", apiContoller.updateCohortAdmin);

module.exports = router;
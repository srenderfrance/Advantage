const express = require("express");
const router = express.Router();
const reviewController = require('../controllers/review');
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, reviewController.getStudent);

router.get("/study", reviewController.getStudy);



module.exports = router;

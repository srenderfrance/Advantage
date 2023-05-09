const express = require("express");
const router = express.Router();
const reviewController = require('../controllers/review');


router.get("/", reviewController.getStudent);

router.get("/study", reviewController.getStudy);



module.exports = router;

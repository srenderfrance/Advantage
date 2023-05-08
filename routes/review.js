const express = require("express");
const router = express.Router();
const reviewController = require('../controlers/review');


router.get("/student", reviewController.getStudent);

router.get("/review", reviewController.getReview);

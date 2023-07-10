const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");
const adminController = require("../controllers/admin");

router.get("/", authController.getLogin);
router.post("/", authController.postLogin);

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/logout", authController.logout);


module.exports = router;
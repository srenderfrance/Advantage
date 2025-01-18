const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");
const adminController = require("../controllers/admin");

router.put("/getVocabList", reviewController.getVocabList);
router.get("/", authController.getLogin);
router.post("/", authController.postLogin);
router.post("/demo", authController.runDemo);
router.post("/preRegister", authController.postPreRegister);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.post("/checkUsername", authController.checkUsername);

router.get("/logout", authController.logout);


module.exports = router;
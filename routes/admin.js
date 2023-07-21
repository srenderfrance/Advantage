const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");
const adminController = require("../controllers/admin");
const upload = require("../middleware/multer")
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, authController.getCohortAdmin);
router.get("/schoolAdmin", ensureAuth, authController.getSchoolAdmin)

router.post("/newCohort", adminController.postCohort);

router.post("/cohortName", adminController.getStudentList);
router.post("/updateCohortAdmin", adminController.updateCohortAdmin);
router.post("/removeCohortAdmin", adminController.removeCohortAdmin);

router.post("/activity", adminController.postActivity);
router.put("/getVocabList", adminController.getActivityVocab);
router.post("/createVocab", adminController.postVocabWord);
router.post("/uploadImage", upload.single("image"), adminController.postVocabImage);
router.post("/uploadAudios", upload.fields([{name:'audioQ', maxCount: 1 }, {name: 'audioT', maxCount: 1}, {name: 'audioN', maxCount: 1}]), adminController.postAudios);



module.exports = router;
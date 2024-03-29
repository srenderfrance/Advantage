const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");
const adminController = require("../controllers/admin");
const upload = require("../middleware/multer")
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, authController.getCohortAdmin);
router.get("/schoolAdmin", ensureAuth, authController.getSchoolAdmin)
router.get("/activityWaL", ensureAuth, authController.getActivityWaLAdmin);
router.get("/activityDD", ensureAuth, authController.getActivityDDAdmin);
router.get("/activityP", ensureAuth, authController.getActivityPAdmin);

router.post("/preReg", adminController.createReg);
router.post("/newCohort", adminController.postCohort);

router.post("/cohortName", adminController.getStudentList);
router.post("/updateCohortAdmin", adminController.updateCohortAdmin);
router.post("/removeCohortAdmin", adminController.removeCohortAdmin);

router.post("/activity", adminController.postActivity);
router.put("/getVocabList", adminController.getActivityVocab); //why is this a put?
router.post("/createVocab", upload.fields([{name: 'image', maxCount: 1}, {name:'audioQ', maxCount: 1}, {name: 'audioTis', maxCount: 1}, {name: 'audioN', maxCount: 1}]), adminController.postVocabWord);
router.put("/replaceImage", upload.single('newImage'), adminController.replaceImage);
router.put("/replaceAudioTis", upload.single('newAudioTis'), adminController.replaceAudioTis);
router.put("/replaceAudioQ", upload.single('newAudioQ'), adminController.replaceAudioQ);
router.put("/replaceAudioN", upload.single('newAudioN'), adminController.replaceAudioN);
router.put("/updateVWord", adminController.updateVocabWord);
router.put("/deleteVWord", adminController.deleteVWord);
router.put("/deleteActivity", adminController.deleteActivity);
router.put("/finalizeActivity", adminController.finalizeActivity);

router.post("/createWaL", upload.fields([{name: 'video', maxCount: 1}, {name: "imageD", maxCount: 1}, {name: 'imageR', maxCount: 1}, {name: 'audioD', maxCount: 1}, {name: 'audioR', maxCount: 1}, {name: 'audioE'}]), adminController.postWaL);
router.put("/getAdditionalInfo", adminController.getAdditionalInfo);
router.put("/deleteWaLActivity", adminController.deleteWaLActivity);
router.put("/deleteWaLMedia", adminController.deleteWaLMedia);
module.exports = router;
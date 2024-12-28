const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const upload = require("../middleware/multer");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, authController.getCohortAdmin);
router.get("/schoolAdmin", ensureAuth, authController.getSchoolAdmin);
router.get("/activityWaL", ensureAuth, authController.getActivityWaLAdmin);
router.get("/activityDD", ensureAuth, authController.getActivityDDAdmin);
router.get("/activityP", ensureAuth, authController.getActivityPAdmin);
/*router.get("/getCohorts", ensureAuth, adminController.getCohortInfo);*/
router.get("/superAdmin", ensureAuth, authController.getSuperAdmin);
router.get("/activityDemo", ensureAuth, authController.getAdminDemo);

router.post("/postDemo", ensureAuth, adminController.createDemo);
router.post("/getMaterialLoader", ensureAuth, adminController.getMaterialUploader);
router.post("/preReg", ensureAuth, adminController.createReg);
router.post("/newSchool", ensureAuth, adminController.createNewSchool);
router.post("/newCohort", ensureAuth, adminController.postCohort);
router.post("/updateCohortAdmin", ensureAuth, adminController.updateCohortAdmin);
router.post("/removeCohortAdmin", ensureAuth, adminController.removeCohortAdmin);
router.post("/activity", ensureAuth, adminController.postActivity);
router.post("/createWaL", ensureAuth, upload.fields([{name: 'video', maxCount: 1}, {name: "imageD", maxCount: 1}, {name: 'imageR', maxCount: 1}, {name: 'audioD', maxCount: 1}, {name: 'audioR', maxCount: 1}, {name: 'mediaE'}]), adminController.postWaL);
router.post("/createVocab", ensureAuth, upload.fields([{name: 'image', maxCount: 1}, {name:'audioQ', maxCount: 1}, {name: 'audioTis', maxCount: 1}, {name: 'audioN', maxCount: 1}]), adminController.postVocabWord);
router.post("/uploadVWFromFolder", ensureAuth, upload.fields([{name:'folderUpload', maxCount: 80}]), adminController.uploadVWFromFolder);

router.put("/replaceImage", ensureAuth, upload.single('newImage'), adminController.replaceImage);
router.put("/getVocabList", ensureAuth, adminController.getActivityVocab); 
router.put("/replaceAudioTis", ensureAuth, upload.single('newAudioTis'), adminController.replaceAudioTis);
router.put("/replaceAudioQ", ensureAuth, upload.single('newAudioQ'), adminController.replaceAudioQ);
router.put("/replaceAudioN", ensureAuth, upload.single('newAudioN'), adminController.replaceAudioN);
router.put("/updateVWord", ensureAuth, adminController.updateVocabWord);
router.put("/deleteVWord", ensureAuth, adminController.deleteVWord);
router.put("/deleteActivity", ensureAuth, adminController.deleteActivity);
router.put("/updateActivity", ensureAuth, adminController.updateActivity);
router.put("/finalizeActivity", ensureAuth, adminController.finalizeActivity);
router.put("/getAdditionalInfo", ensureAuth, adminController.getAdditionalInfo);
router.put("/deleteWaLActivity", ensureAuth, adminController.deleteWaLActivity);
router.put("/deleteWaLMedia", ensureAuth, adminController.deleteWaLMedia);
router.put("/getActivities", ensureAuth, adminController.getActivities);

module.exports = router;
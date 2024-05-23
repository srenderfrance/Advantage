const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const { ensureAuth } = require('../middleware/auth');


router.get('/', ensureAuth, reviewController.getStudent);
router.get('/customAandD', ensureAuth, reviewController.getDictionary);
router.get('/getSelectedVocab', ensureAuth, reviewController.getSelectedVocab);

router.put('/getAllVocab', ensureAuth, reviewController.getAllVocab);
router.put('/getVocabList', ensureAuth, reviewController.getVocabList);

router.post('/reviewActivity', ensureAuth, reviewController.reviewActivity)
router.post('/saveSelectedVocab', ensureAuth,reviewController.saveSelectedVocab);
router.post('/createCustomActivity', ensureAuth, reviewController.createCustomActivity);
router.post('/reviewResults', ensureAuth, reviewController.userReviewResults);
router.post('/reviewCustomActivity', ensureAuth, reviewController.reviewCustomActivity);
router.post('/reviewByCategory', ensureAuth, reviewController.reviewByCategory);
router.post('/deleteCustomActivity', ensureAuth, reviewController.deleteCustomActivity); 
router.post('/updateIndividualExercise', ensureAuth, reviewController.updateIndividualExercise);
router.post('/removeFromCollection', ensureAuth, reviewController.removeFromCollection);
router.post('/moveToCollection', ensureAuth, reviewController.moveToCollection);
router.post('/removeFromActivity', ensureAuth, reviewController.removeFromActivity);
router.post('/getActivities', ensureAuth, reviewController.getActivities);

module.exports = router

//cSpell:ignore Aand
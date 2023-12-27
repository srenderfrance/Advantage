const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const { ensureAuth } = require('../middleware/auth');


router.get('/', ensureAuth, reviewController.getStudent);


router.post('/reviewActivity', reviewController.reviewActivity)
//router.post('/reviewActivityDD', reviewController.reviewActivityDD);
//router.post('/reviewActivityWaL', reviewController.reviewActivityWaL)
router.put('/getVocabList', reviewController.getVocabList);
router.get('/getSelectedVocab', reviewController.getSelectedVocab);
router.post('/createCustomActivity', reviewController.createCustomActivity);

router.post('/reviewResults', reviewController.userReviewResults);
router.post('/reviewCustomActivity', reviewController.reviewCustomActivity);
router.post('/reviewByCategory', reviewController.reviewByCategory);
router.post('/deleteCustomActivity', reviewController.deleteCustomActivity);
module.exports = router

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const { ensureAuth } = require('../middleware/auth');


router.get('/', ensureAuth, reviewController.getStudent);

router.get('/study', ensureAuth, reviewController.getStudy);
router.post('/reviewActivity', reviewController.reviewActivity);
router.put('/getVocabList', reviewController.getVocabList);

router.post('/reviewResults', reviewController.userReviewResults);

module.exports = router;

const express = require("express");
const router = express.Router();
const adminController = require('../controlers/admin');

router.post('/admin', adminController.postCohort);

module.exports = router;
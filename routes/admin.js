const express = require("express");
const router = express.Router();
const adminController = require('../controlers/admin');

router.post('/admin', adminController.postcreateCohort);

module.exports = router;
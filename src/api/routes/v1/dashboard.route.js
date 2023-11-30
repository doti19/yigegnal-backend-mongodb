const express = require('express');
const auth = require('../../middlewares/auth');
const dashboardController = require('../../controllers/dashboard.controller');

const router = express.Router();

router.get('/',auth.auth(),auth.emailVerified(), dashboardController.dashboard);


module.exports = router;
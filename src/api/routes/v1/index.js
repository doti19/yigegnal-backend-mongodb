const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const foundItemRoutes = require('./foundItem.route');
const inquiryRoutes = require('./inquiry.route');
const catagoryRoutes = require('./catagory.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/founded-item', foundItemRoutes);
router.use('/inquiry', inquiryRoutes);
router.use('/catagory', catagoryRoutes);
router.use('/auth', authRoutes);

module.exports = router;

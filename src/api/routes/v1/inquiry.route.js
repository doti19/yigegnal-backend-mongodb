const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const inquiryValidation = require('../../validations/inquiry.validation');
const inquiryController = require('../../controllers/inquiry.controller');
const auth = require('../../middlewares/auth');
// const {restrictTo} = require('../../middlewares/auth');


const router = express.Router();

router
    .route('/')
    .get( auth.auth(),auth.emailVerified(),validator.query(inquiryValidation.getInquiries.query),inquiryController.getInquiries)
    .post(auth.auth(),auth.emailVerified(),auth.restrictTo(['super_admin','admin', 'db_analysist']),validator.body(inquiryValidation.createInquiry.body), inquiryController.createInquiry);

router.get('/pending', auth.auth(),auth.emailVerified(),inquiryController.getPendingInquiries) ;
router
    .route('/:inquiryId')
    .get(auth.auth(),auth.emailVerified(),validator.params(inquiryValidation.getInquiry.params), inquiryController.getInquiry)
    .patch(auth.auth(),auth.emailVerified(),auth.restrictTo(['super_admin','admin', 'db_analysist']),validator.params(inquiryValidation.updateInquiry.params),validator.body(inquiryValidation.updateInquiry.body),inquiryController.updateInquiry)
    .delete(auth.auth(),auth.emailVerified(),auth.restrictTo(['super_admin','admin', 'db_analysist']),validator.params(inquiryValidation.deleteInquiry.params),inquiryController.deleteInquiry);

router.patch('/status/:inquiryId', auth.auth(),auth.emailVerified(),validator.params(inquiryValidation.updateInquiryStatus.params),validator.body(inquiryValidation.updateInquiryStatus.body), inquiryController.updateStatus);


    module.exports = router;
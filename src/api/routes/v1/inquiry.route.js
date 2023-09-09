const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const inquiryValidation = require('../../validations/inquiry.validation');
const inquiryController = require('../../controllers/inquiry.controller');
const auth = require('../../middlewares/auth');
// const {restrictTo} = require('../../middlewares/auth');


const router = express.Router();

router
    .route('/')
    .get( auth.auth(),validator.query(inquiryValidation.getInquiries.query),inquiryController.getInquiries)
    .post(auth.auth(),validator.body(inquiryValidation.createInquiry.body), inquiryController.createInquiry);

router.get('/pending', inquiryController.getPendingInquiries) ;
router
    .route('/:inquiryId')
    .get(validator.params(inquiryValidation.getInquiry.params), inquiryController.getInquiry)
    .patch(validator.params(inquiryValidation.updateInquiry.params),validator.body(inquiryValidation.updateInquiry.body),inquiryController.updateInquiry)
    .delete(validator.params(inquiryValidation.deleteInquiry.params),inquiryController.deleteInquiry);

router.patch('/status/:inquiryId', validator.params(inquiryValidation.updateInquiryStatus.params),validator.body(inquiryValidation.updateInquiryStatus.body), inquiryController.updateStatus);


    module.exports = router;
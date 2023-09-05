const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const catagoryValidation = require('../../validations/catagory.validation');
const catagoryController = require('../../controllers/catagory.controller');
const auth = require('../../middlewares/auth');
// const {restrictTo} = require('../../middlewares/auth');


const router = express.Router();

router
    .route('/')
    .get( auth.auth(),catagoryController.getCatagories)
    .post(validator.body(catagoryValidation.createCatagory.body), catagoryController.createCatagory);

router
    .route('/:catagoryId')
    .get(validator.params(catagoryValidation.getCatagory.params), catagoryController.getCatagory)
    .patch(validator.params(catagoryValidation.updateCatagory.params),validator.body(catagoryValidation.updateCatagory.body),catagoryController.updateCatagory)
    .delete(validator.params(catagoryValidation.deleteCatagory.params),catagoryController.deleteCatagory);



    module.exports = router;
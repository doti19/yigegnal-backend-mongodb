const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const foundedItemValidation =  require('../../validations/foundedItem.validation');
const foundedItemController = require('../../controllers/foundedItem.controller');

const router = express.Router();

router
    .route('/')
    // .get(itemController.getItems)
    .post(validator.body(foundedItemValidation.createFoundedItem.body), foundedItemController.createFoundedItem);


    module.exports = router;
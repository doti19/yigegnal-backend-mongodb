const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const foundedItemValidation =  require('../../validations/foundedItem.validation');
const foundedItemController = require('../../controllers/foundedItem.controller');

const router = express.Router();

router
    .route('/')
    .get( validator.query(foundedItemValidation.getFoundedItems.query),foundedItemController.getFoundedItems)
    .post(validator.body(foundedItemValidation.createFoundedItem.body), foundedItemController.createFoundedItem);

    router
    .route('/:foundedItemId')
    .get(validator.params(foundedItemValidation.getFoundedItem.params), foundedItemController.getFoundedItem)
    .patch(validator.params(foundedItemValidation.updateFoundedItem.params),validator.body(foundedItemValidation.updateFoundedItem.body),foundedItemController.updateFoundedItem)
    .delete(validator.params(foundedItemValidation.deleteFoundedItem.params),foundedItemController.deleteFoundedItem);

   

router.patch('/status/:foundedItemId', validator.params(foundedItemValidation.updateFoundedItemStatus.params),validator.body(foundedItemValidation.updateFoundedItemStatus.body), foundedItemController.updateStatus);


    module.exports = router;
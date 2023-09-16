const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const foundedItemValidation =  require('../../validations/foundedItem.validation');
const foundedItemController = require('../../controllers/foundedItem.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(auth.auth(),auth.emailVerified(), validator.query(foundedItemValidation.getFoundedItems.query),foundedItemController.getFoundedItems)
    .post(auth.auth(),auth.emailVerified(),auth.restrictTo(['super_admin','admin', 'db_analysist']),validator.body(foundedItemValidation.createFoundedItem.body), foundedItemController.createFoundedItem);
router.get('/not-delivered',auth.auth(),auth.emailVerified(), foundedItemController.getNotDeliveredFoundItems) ;
    router
    .route('/:foundedItemId')
    .get(auth.auth(),auth.emailVerified(),validator.params(foundedItemValidation.getFoundedItem.params), foundedItemController.getFoundedItem)
    .patch(auth.auth(),auth.emailVerified(),auth.restrictTo(['super_admin','admin', 'db_analysist']),validator.params(foundedItemValidation.updateFoundedItem.params),validator.body(foundedItemValidation.updateFoundedItem.body),foundedItemController.updateFoundedItem)
    .delete(auth.auth(),auth.emailVerified(),auth.restrictTo(['super_admin','admin', 'db_analysist']),validator.params(foundedItemValidation.deleteFoundedItem.params),foundedItemController.deleteFoundedItem);

   
  

router.patch('/status/:foundedItemId',auth.auth(),auth.emailVerified(),auth.restrictTo(['super_admin','admin', 'db_analysist']), validator.params(foundedItemValidation.updateFoundedItemStatus.params),validator.body(foundedItemValidation.updateFoundedItemStatus.body), foundedItemController.updateStatus);


    module.exports = router;
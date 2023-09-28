const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../errors/api-error');
const catchAsync = require('../utils/catchAsync');
const { foundedItemService } = require('../services');
const logger = require("../../config/logger");
const createFoundedItem = catchAsync(async (req, res) => {
 
  
    const foundedItem = await foundedItemService.createFoundedItem(req.body, req.user);
    res.status(httpStatus.CREATED).send(foundedItem);
  });

  const getFoundedItems = catchAsync(async(req, res)=>{
    const filter = pick(req.query, ['status', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'noLimit']);
    const result = await foundedItemService.getFoundedItems(filter, options);
    res.send(result);
});

const getFoundedItem = catchAsync(async(req, res)=>{
    const foundedItem = await foundedItemService.getFoundedItemById(req.params.foundedItemId);
  if (!foundedItem) {
    throw new ApiError({status: httpStatus.NOT_FOUND, message: 'Inquiry not found'});
  }
  res.send(foundedItem);
});

const updateFoundedItem = catchAsync(async(req, res)=>{
    const foundedItem = await foundedItemService.updateFoundedItemById(req.params.foundedItemId, req.body);
  res.send(foundedItem);
});

const deleteFoundedItem = catchAsync(async(req, res)=>{
    await foundedItemService.deleteFoundedItemById(req.params.foundedItemId);
    res.status(httpStatus.NO_CONTENT).send();
});

const updateStatus = catchAsync(async(req, res)=>{
    const foundedItem = await foundedItemService.updateFoundedItemStatus(req.params.foundedItemId, req.user, req.body);
    res.send(foundedItem)
});

  const getNotDeliveredFoundItems = catchAsync(async(req, res)=>{
    const filter = pick(req.query, ['foundedDate', 'role'], 'status=Pending');
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const result = await foundedItemService.getNotDeliveredFoundItems(filter, options);
    res.send(result);
});



  module.exports = {
   createFoundedItem,
   getFoundedItems,
   getFoundedItem,
   updateFoundedItem,
   deleteFoundedItem,
   updateStatus,
   getNotDeliveredFoundItems


  }
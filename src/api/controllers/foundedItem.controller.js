const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../errors/api-error');
const catchAsync = require('../utils/catchAsync');
const { foundedItemService } = require('../services');

const createFoundedItem = catchAsync(async (req, res) => {
 
    const item = await foundedItemService.createFoundedItem(req.body);
    res.status(httpStatus.CREATED).send(item);
  });

  module.exports = {
   createFoundedItem,
  }
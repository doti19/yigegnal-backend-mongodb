const httpStatus = require('http-status');
const { FoundedItem } = require('../models');
const {Catagory} = require('../models');
const ApiError = require('../errors/api-error');

/**
 * Create an item
 * @param {Object} itemBody
 * @returns {Promise<item>}
 */
const createFoundedItem = async (foundedItemBody) => {
// const catagories = await Catagory.find();
const isIt = await Catagory.isCatagoryFound(foundedItemBody.catagory);
   if (!isIt) throw new ApiError({status: httpStatus.BAD_REQUEST, message:'invalid catagory name '});

   if(foundedItemBody['lostDate'])
   foundedItemBody.lostDate = new Date(foundedItemBody.lostDate);



  return await FoundedItem.create(foundedItemBody);
};


module.exports = {
    createFoundedItem,
}
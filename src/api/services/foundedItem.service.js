const httpStatus = require('http-status');
const { FoundedItem } = require('../models');
const {Catagory} = require('../models');
const ApiError = require('../errors/api-error');


const createFoundedItem = async (foundedItemBody) => {
// const catagories = await Catagory.find();
const isIt = await Catagory.isCatagoryFound(foundedItemBody.item.catagory);
   if (!isIt) throw new ApiError({status: httpStatus.BAD_REQUEST, message:'invalid catagory name '});
  return await FoundedItem.create(foundedItemBody);
};


const getFoundedItems = async(filter, options)=>{
  const foundedItems = await FoundedItem.paginateIt(filter, options);

  return foundedItems;
}

const getPendingItems = async(filter, options)=>{
  const foundedItems = await FoundedItem.paginateIt(filter, options);

  return foundedItems;
}

const getFoundedItemById = async(foundedItemId)=>{
  const foundedItem = await FoundedItem.findById(foundedItemId);
  return foundedItem;
}

const updateFoundedItemById= async(foundedItemId, updateBody) =>{
  const foundedItem = await getFoundedItemById(foundedItemId);
  if(!foundedItem){
    throw new ApiError({status: httpStatus.NOT_FOUND, message: 'Item not found'});
  }
  //TODO should we edit if it is already delivered
  // if(FoundedItem.isFound || FoundedItem.status=="Found"){
  //   throw new ApiError(httpStatus., 'FoundedItem not found');
  // }
  Object.assign(foundedItem, updateBody);
  await foundedItem.save();
  return foundedItem;

}

const deleteFoundedItemById = async(foundedItemId) =>{
  const foundedItem = await getFoundedItemById(foundedItemId);
  if(!foundedItem){
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Not found');
  }
  await foundedItem.deleteOne();
  return foundedItem;
}

const updateFoundedItemStatus = async(foundedItemId, updateBody) =>{
  const foundedItem = await getFoundedItemById(foundedItemId);
  if(!foundedItem){
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  if(foundedItem.status=='Delivered' || foundedItem.status == updateBody.status){
    throw new ApiError({status: httpStatus.BAD_REQUEST, message:'Nothing to Edit here'});
  }
  if(updateBody.status=='Delivered' && foundedItem.status != "Delivered"){
    foundedItem.status = 'Delivered';
    foundedItem.deliveredBy= updateBody.deliveredBy;
   foundedItem.deliveryDate = Date.now();
  } else{
    foundedItem.status = updateBody.status;
  }
  await foundedItem.save();
  return foundedItem;
}
    
    module.exports = {
      createFoundedItem,
      getFoundedItems,
    getFoundedItemById,
    updateFoundedItemById,
    deleteFoundedItemById,
    updateFoundedItemStatus,
    getPendingItems,
    }

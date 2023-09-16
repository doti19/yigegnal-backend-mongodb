const httpStatus = require('http-status');
const { FoundedItem } = require('../models');
const {Catagory} = require('../models');
const ApiError = require('../errors/api-error');
const {customAlphabet} = require("nanoid/non-secure");
const nanoid = customAlphabet('1234567890', 6);




const createFoundedItem = async (foundedItemBody, user) => {
// const catagories = await Catagory.find();

const isIt = await Catagory.isCatagoryFound(foundedItemBody.item.catagory);
   if (!isIt) throw new ApiError({status: httpStatus.BAD_REQUEST, message:'invalid catagory name '});
  foundedItemBody.registeredBy = user.id;
//  foundedItemBody.foundedItemId = nanoid();

  hello =  await FoundedItem.create(foundedItemBody);
  console.log(hello)
  return hello;
};


const getFoundedItems = async(filter, options)=>{
  const foundedItems = await FoundedItem.paginateIt(filter, options);

  return foundedItems;
}

const getNotDeliveredFoundItems = async(filter, options)=>{
  // const foundedItems = await FoundedItem.paginateIt(filter, options);
 
  const foundedItems = await FoundedItem.find({}).where({
    'status': 'Not Delivered'
  })
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found ' );
  }
  console.log('original');
  console.log(foundedItem);
  if(foundedItem.status == updateBody.status){
    throw new ApiError({status: httpStatus.BAD_REQUEST, message:'Nothing to Edit here'});
  }
  if(updateBody.status=='Delivered' && foundedItem.status != "Delivered"){
    foundedItem.status = 'Delivered';
    foundedItem.deliveredBy= updateBody.deliveredBy;
   foundedItem.deliveryDate = Date.now();
  } else if(updateBody.status=='Pending' && foundedItem.status !="Pending"){

    if(foundedItem.status=="Delivered"){
      foundedItem.deliveredBy = undefined;
      foundedItem.deliveryDate = undefined;
    }
console.log('am heree');
    foundedItem.status = 'Pending';
    foundedItem.hasInquiry = updateBody.hasInquiry;

    foundedItem.inquiryId = updateBody.hasInquiry? updateBody.inquiryId: undefined;
    console.log(foundedItem);

  } else if(updateBody.status == 'Not Delivered' && foundedItem.status !='Not Delivered'){
    if(foundedItem.status=="Delivered"){
      foundedItem.deliveredBy = undefined;
     foundedItem.deliveryDate= undefined;
    } else if(foundedItem.status=='Pending'){
       foundedItem.inquiryId =undefined;
       foundedItem.hasInquiry = false;
    }
    foundedItem.status = 'Not Delivered';
    console.log('not delivered');
     console.log(foundedItem)
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
    getNotDeliveredFoundItems,
    }

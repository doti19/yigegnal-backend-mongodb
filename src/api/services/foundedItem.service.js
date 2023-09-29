const httpStatus = require('http-status');
const { FoundedItem } = require('../models');
const { Inquiry } = require('../models');
const {Catagory} = require('../models');
// const { inquiryService } = require('../services');

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

const deleteFoundedItemById = async(foundedItemId,user) =>{
const { inquiryService } = require('.');

  const foundedItem = await getFoundedItemById(foundedItemId);


  if(!foundedItem){
    throw new ApiError({status: httpStatus.NOT_FOUND, message:'Item Not found'});
  }
  if(foundedItem.hasInquiry ){
    console.log("it has inquiry");
    
    await inquiryService.updateInquiryStatus(
      foundedItem.inquiryId,
      user,
      true,
      {
        status: 'Pending'
      }
    );
  }
  await foundedItem.deleteOne();
  return foundedItem;
}

const updateFoundedItemStatus = async(foundedItemId, user,fromInquiry, updateBody) =>{
const { inquiryService } = require('.');
//TODO fix this later, the circular dependency thing

  const foundedItem = await getFoundedItemById(foundedItemId);
  if(!foundedItem ){
    if(!fromInquiry){

      throw new ApiError({status:httpStatus.NOT_FOUND, message:'Item not found' });
    }else{
      return;
    }
  }
  
  if(foundedItem.status=="Delivered"&& !(user.role=='admin'|| user.role=="super_admin")){
      throw new ApiError({status: httpStatus.FORBIDDEN, message:'You are not allowed to change a delivered item'});
  }
  if(foundedItem.status == updateBody.status && !fromInquiry){
    throw new ApiError({status: httpStatus.BAD_REQUEST, message:'Nothing to Edit here'});
  }
  if(updateBody.status=='Delivered' && foundedItem.status != "Delivered"){

    if(user.role== "admin"|| user.role=="super_admin" || user.role=='db_analysist'){
      // if(foundedItem.hasInquiry && !fromInquiry){
      //   console.log('item has inquiry');
      //   await inquiryService.updateInquiryStatus(foundedItem.inquiryId,true, user, {
      //     status: "Pending"
      //   })
      // }
      // why the fuck would i need the above code??????
    foundedItem.status = 'Delivered';
    foundedItem.deliveredBy= updateBody.deliveredBy;
   foundedItem.deliveryDate = Date.now();
    }else{
      throw new ApiError({status: httpStatus.FORBIDDEN, message:'You are not allowed to do that, please contact your administrator'});
    }

  } else if(updateBody.status=='Pending' && foundedItem.status !="Pending"){

    if(foundedItem.status=="Delivered" ){
      foundedItem.deliveredBy = undefined;
      foundedItem.deliveryDate = undefined;
    } 
    if(updateBody.hasInquiry && !fromInquiry){
      console.log('am here calliing');
      console.log(updateBody);
    
      await inquiryService.updateInquiryStatus(updateBody.inquiryId,user,true, {
        status: "Found",
        foundedItemId: foundedItemId,
      });
    }
console.log('am heree');
    foundedItem.status = 'Pending';
    foundedItem.hasInquiry = updateBody.hasInquiry;

    foundedItem.inquiryId = updateBody.hasInquiry? updateBody.inquiryId: undefined;
    console.log(foundedItem);

  } else if(updateBody.status == 'Not Delivered' && foundedItem.status !='Not Delivered'){
    if(foundedItem.hasInquiry && !fromInquiry){
      console.log('item has inquiry');
      await inquiryService.updateInquiryStatus(foundedItem.inquiryId,true, user, {
        status: "Pending"
      })
    }
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

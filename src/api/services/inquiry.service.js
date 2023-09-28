const httpStatus = require('http-status');
const { Inquiry } = require('../models');
const {Catagory} = require('../models');
const ApiError = require('../errors/api-error');

/**
 * Create an item
 * @param {Object} inquiryBody
 * @returns {Promise<item>}
 */
const createInquiry = async (inquiryBody, user) => {
  const isIt = await Catagory.isCatagoryFound(inquiryBody.item.catagory);
   if (!isIt) throw new ApiError({status: httpStatus.BAD_REQUEST, message:'invalid catagory name '});
  inquiryBody.registeredBy = user.id;
      return await Inquiry.create(inquiryBody);
    };
  
const getInquiries = async(filter, options)=>{
  
  const inquiries = await Inquiry.paginateIt(filter, options);

  return inquiries;
}

const getPendingInquiries = async(filter, options)=>{
  // const foundedItems = await FoundedItem.paginateIt(filter, options);
 
  const inquiry = await Inquiry.find({}).where({
    'status': 'Pending'
  })
  return inquiry;
}

const getInquiryById = async(inquiryId)=>{
  const inquiry = await Inquiry.findById(inquiryId);
  return inquiry;
}

const updateInquiryById= async(InquiryId, updateBody) =>{
 console.log(updateBody);
  const inquiry = await getInquiryById(InquiryId);
  if(!inquiry){
    throw new ApiError(httpStatus.NOT_FOUND, 'Inquiry not found');
  }
  //TODO should we edit if it is already found
  // if(inquiry.isFound || inquiry.status=="Found"){
  //   throw new ApiError(httpStatus., 'Inquiry not found');
  // }
  if(updateBody.item && updateBody.item.catagory){


   const isIt = await Catagory.isCatagoryFound(updateBody.item.catagory);
   if (!isIt) throw new ApiError({status: httpStatus.BAD_REQUEST, message:'invalid catagory name '});
   }
  Object.assign(inquiry.item, updateBody.item);
  Object.assign(inquiry.owner, updateBody.owner);
  // Object.assign(inquiry, updateBody);
  console.log('am here');
  console.log(inquiry);
  await inquiry.save();
  return inquiry;

}

const deleteInquiryById = async(inquiryId) =>{
  const inquiry = await getInquiryById(inquiryId);
  if(!inquiry){
    throw new ApiError(httpStatus.NOT_FOUND, 'Inquiry Not found');
  }
  await inquiry.deleteOne();
  return inquiry;
}

const updateInquiryStatus = async(inquiryId, updateBody) =>{
  const inquiry = await getInquiryById(inquiryId);
  if(!inquiry){
    throw new ApiError(httpStatus.NOT_FOUND, 'Inquiry not found');
  }
  if( inquiry.status == updateBody.status){
    throw new ApiError({status: httpStatus.BAD_REQUEST, message:'Nothing to Edit here'});
  }
  if(updateBody.status=='Found' && inquiry.status != "Found"){
    inquiry.status = 'Found';
    inquiry.isFound= true;
    inquiry.foundedItemId = updateBody.foundedItemId;
  } else if(updateBody.status=='Pending' && inquiry.status !='Pending'){
    if(inquiry.isFound == true){
    inquiry.foundedItemId = undefined;
      inquiry.isFound = false;
    }
    inquiry.status = 'Pending';
  }
  // console.log(inquiry.foundedItemId);
  await inquiry.save();
  return inquiry;
}
    
    module.exports = {
      createInquiry,
      getInquiries,
    getInquiryById,
    getPendingInquiries,
    updateInquiryById,
    deleteInquiryById,
    updateInquiryStatus
    }
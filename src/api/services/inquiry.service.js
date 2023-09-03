const httpStatus = require('http-status');
const { Inquiry } = require('../models');
const {Catagory} = require('../models');
const ApiError = require('../errors/api-error');

/**
 * Create an item
 * @param {Object} inquiryBody
 * @returns {Promise<item>}
 */
const createInquiry = async (inquiryBody) => {
  
      return await Inquiry.create(inquiryBody);
    };
  
const getInquiries = async(filter, options)=>{
  const inquiries = await Inquiry.paginateIt(filter, options);

  return inquiries;
}

const getInquiryById = async(inquiryId)=>{
  const inquiry = await Inquiry.findById(inquiryId);
  return inquiry;
}

const updateInquiryById= async(InquiryId, updateBody) =>{
  const inquiry = await getInquiryById(InquiryId);
  if(!inquiry){
    throw new ApiError(httpStatus.NOT_FOUND, 'Inquiry not found');
  }
  //TODO should we edit if it is already found
  // if(inquiry.isFound || inquiry.status=="Found"){
  //   throw new ApiError(httpStatus., 'Inquiry not found');
  // }
  Object.assign(inquiry, updateBody);
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
  if(inquiry.status=='Delivered' || inquiry.status == updateBody.status){
    throw new ApiError({status: httpStatus.BAD_REQUEST, message:'Nothing to Edit here'});
  }
  if(updateBody.status=='Found' && inquiry.status != "Delivered"){
    inquiry.status = 'Found';
    inquiry.isFound= true;
    inquiry.foundedItemId = updateBody.foundedItemId;
  } else{
    inquiry.status = updateBody.status;
  }
  await inquiry.save();
  return inquiry;
}
    
    module.exports = {
      createInquiry,
      getInquiries,
    getInquiryById,
    updateInquiryById,
    deleteInquiryById,
    updateInquiryStatus
    }
const httpStatus = require("http-status");
const { Inquiry } = require("../models");
const { Catagory } = require("../models");

const ApiError = require("../errors/api-error");
const { foundedItemService } = require("../services");

/**
 * Create an item
 * @param {Object} inquiryBody
 * @returns {Promise<item>}
 */
const createInquiry = async (inquiryBody, user) => {
  const isIt = await Catagory.isCatagoryFound(inquiryBody.item.catagory);
  if (!isIt)
    throw new ApiError({
      status: httpStatus.BAD_REQUEST,
      message: "invalid catagory name ",
    });
  inquiryBody.registeredBy = user.id;
  return await Inquiry.create(inquiryBody);
};

const getInquiries = async (filter, options) => {
  const inquiries = await Inquiry.paginateIt(filter, options);

  return inquiries;
};

const getPendingInquiries = async (filter, options) => {
  // const foundedItems = await FoundedItem.paginateIt(filter, options);

  const inquiry = await Inquiry.find({}).where({
    status: "Pending",
  });
  return inquiry;
};

const getInquiryById = async (inquiryId) => {
  const inquiry = await Inquiry.findById(inquiryId);
  return inquiry;
};

const updateInquiryById = async (InquiryId, updateBody) => {
  console.log(updateBody);
  const inquiry = await getInquiryById(InquiryId);
  if (!inquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, "Inquiry not found");
  }
  //TODO should we edit if it is already found
  // if(inquiry.isFound || inquiry.status=="Found"){
  //   throw new ApiError(httpStatus., 'Inquiry not found');
  // }
  if (updateBody.item && updateBody.item.catagory) {
    const isIt = await Catagory.isCatagoryFound(updateBody.item.catagory);
    if (!isIt)
      throw new ApiError({
        status: httpStatus.BAD_REQUEST,
        message: "invalid catagory name ",
      });
  }
  Object.assign(inquiry.item, updateBody.item);
  Object.assign(inquiry.owner, updateBody.owner);
  // Object.assign(inquiry, updateBody);
  console.log("am here");
  console.log(inquiry);
  await inquiry.save();
  return inquiry;
};

const deleteInquiryById = async (inquiryId, user) => {
  const inquiry = await getInquiryById(inquiryId);
  if (!inquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, "Inquiry Not found");
  }
  if (inquiry.isFound) {
    console.log("inquiry status is found");
    // const foundedItem = foundedItemService.getFoundedItemById(
    //   inquiry.foundedItemId
    // );
    // if (foundedItem && foundedItem.status == "Delivered") {
    //   console.log("founded item is delivered");
    //   throw new ApiError({
    //     status: httpStatus.UNAUTHORIZED,
    //     message: "Cannot delete a delivered inquiry",
    //   });
    // } else {
      console.log("founded item is not delivered, so change");
      //  try{

      await foundedItemService.updateFoundedItemStatus(
        inquiry.foundedItemId,
        user,
        true,
        {
          status: "Not Delivered",
        }
      );
      // } catch(e){
      //   console.log( e);
      // throw new ApiError({status: httpStatus.FORBIDDEN, message:e});

      // }
    // }
  }
  console.log("about to delete this inquiry");
  await inquiry.deleteOne();
  return inquiry;
};

const updateInquiryStatus = async (inquiryId, user, fromItem, updateBody) => {
  console.log("calling update status inquiry");
  // console.log(updateBody);
  const inquiry = await getInquiryById(inquiryId);
  if (!inquiry) {
    if(!fromItem){

      throw new ApiError(httpStatus.NOT_FOUND, "Inquiry not found");
    }else{
      return;
    }
  }
  if (inquiry.status == updateBody.status && !fromItem) {
    throw new ApiError({
      status: httpStatus.BAD_REQUEST,
      message: "Nothing to Edit here",
    });
  }

  if (updateBody.status == "Found" && inquiry.status != "Found") {
    if (!fromItem) {
      await foundedItemService.updateFoundedItemStatus(
        updateBody.foundedItemId,
        user,
        true,
        {
          status: "Pending",
          hasInquiry: true,
          inquiryId: inquiryId,
        }
      );
    }
    inquiry.status = "Found";
    inquiry.isFound = true;
    inquiry.foundedItemId = updateBody.foundedItemId;
  } else if (updateBody.status == "Pending" && inquiry.status != "Pending") {
    if (inquiry.isFound && !fromItem) {
      console.log("inquiry status is found");
      const foundedItem = foundedItemService.getFoundedItemById(
        inquiry.foundedItemId
      );
      if (
        foundedItem &&
        foundedItem.status == "Delivered" &&
        !(user.role == "admin" || user.role == "super_admin")
      ) {
        console.log("founded item is delivered");
        throw new ApiError({
          status: httpStatus.FORBIDDEN,
          message: "Item already delivered",
        });
      } else {
        console.log("founded item is not delivered, so change");
        //  try{

        await foundedItemService.updateFoundedItemStatus(
          inquiry.foundedItemId,
          user,
          true,
          {
            status: "Not Delivered",
          }
        );
        // } catch(e){
        // throw new ApiError({status: httpStatus.FORBIDDEN, message:e.message});

        // }
      }
    }
    if (inquiry.isFound == true) {
      inquiry.foundedItemId = undefined;
      inquiry.isFound = false;
    }
    inquiry.status = "Pending";
  }
  // console.log(inquiry.foundedItemId);
  await inquiry.save();
  return inquiry;
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  getPendingInquiries,
  updateInquiryById,
  deleteInquiryById,
  updateInquiryStatus,
};

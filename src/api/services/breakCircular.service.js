
const httpStatus = require("http-status");
const { Inquiry } = require("../models");
const { Catagory } = require("../models");

const ApiError = require("../errors/api-error");
const updateInquiryStatus = async (inquiryId, user, updateBody) => {
    console.log("calling update status inquiry");
    // console.log(updateBody);
    const inquiry = await getInquiryById(inquiryId);
    if (!inquiry) {
      throw new ApiError(httpStatus.NOT_FOUND, "Inquiry not found");
    }
    if (inquiry.status == updateBody.status) {
      throw new ApiError({
        status: httpStatus.BAD_REQUEST,
        message: "Nothing to Edit here",
      });
    }
  
    if (updateBody.status == "Found" && inquiry.status != "Found") {
    
      inquiry.status = "Found";
      inquiry.isFound = true;
      inquiry.foundedItemId = updateBody.foundedItemId;
    } else if (updateBody.status == "Pending" && inquiry.status != "Pending") {
     
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
    updateInquiryStatus,

}
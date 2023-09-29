const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../errors/api-error');
const catchAsync = require('../utils/catchAsync');
const { inquiryService } = require('../services');
const qs = require('qs');

const createInquiry = catchAsync(async(req, res) => {
    const inquiry = await inquiryService.createInquiry(req.body, req.user);
    res.status(httpStatus.CREATED).send(inquiry);
});



const getInquiries = catchAsync(async(req, res)=>{
 if(req.query.item?.lostPlace){
  req.query['item.lostPlace'] = req.query.item.lostPlace;
 }
    const filter = pick(req.query, ['status', 'item.lostPlace']);
  // console.log(req.query.item?.lostPlace);
    
    // const filter = req.query.
    // const filter = qs.parse(req.query);
    // console.log(filter);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    
    const result = await inquiryService.getInquiries(filter, options);
    res.send(result);
});

const getInquiry = catchAsync(async(req, res)=>{
    const inquiry = await inquiryService.getInquiryById(req.params.inquiryId);
  if (!inquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inquiry not found');
  }
  res.send(inquiry);
});

const updateInquiry = catchAsync(async(req, res)=>{
    const inquiry = await inquiryService.updateInquiryById(req.params.inquiryId, req.body);
  res.send(inquiry);
});

const deleteInquiry = catchAsync(async(req, res)=>{
    await inquiryService.deleteInquiryById(req.params.inquiryId, req.user);
    res.status(httpStatus.NO_CONTENT).send();
});

const updateStatus = catchAsync(async(req, res)=>{
    const inquiry = await inquiryService.updateInquiryStatus(req.params.inquiryId,req.user,false, req.body);
    res.send(inquiry)
})


 const getPendingInquiries = catchAsync(async(req, res)=>{
    const filter = pick(req.query, ['foundedDate', 'role'], 'status=Pending');
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const result = await inquiryService.getPendingInquiries(filter, options);
    res.send(result);
});


module.exports = {
    createInquiry,
    getInquiries,
    getInquiry,
    updateInquiry,
    deleteInquiry,
    updateStatus,
    getPendingInquiries
}

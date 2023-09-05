const httpStatus = require('http-status');
const ApiError = require('../errors/api-error');
const catchAsync = require('../utils/catchAsync');
const {catagoryService } = require('../services');

const createCatagory = catchAsync(async(req, res)=>{
    const catagory = await catagoryService.createCatagory(req.body);
    res.status(httpStatus.CREATED).send(catagory);

});


const getCatagories = catchAsync(async(req, res)=>{
       const result = await catagoryService.getCatagories();
       res.send(result);
   });
   
   const getCatagory = catchAsync(async(req, res)=>{
       const catagory = await catagoryService.getCatagoryById(req.params.catagoryId);
     if (!catagory) {
       throw new ApiError(httpStatus.NOT_FOUND, 'Catagory not found');
     }
     res.send(catagory);
   });
   
   const updateCatagory = catchAsync(async(req, res)=>{
       const catagory = await catagoryService.updateCatagoryById(req.params.catagoryId, req.body);
     res.send(catagory);
   });
   
   const deleteCatagory = catchAsync(async(req, res)=>{
       await catagoryService.deleteCatagoryById(req.params.catagoryId);
       res.status(httpStatus.NO_CONTENT).send();
   });
   
 
   
   module.exports = {
       createCatagory,
       getCatagories,
       getCatagory,
       updateCatagory,
       deleteCatagory,
       
   }
   
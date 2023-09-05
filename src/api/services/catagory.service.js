const httpStatus = require('http-status');
const {Catagory} = require('../models');
const ApiError = require('../errors/api-error');

/**
 * Create an item
 * @param {Object} catagoryBody
 * @returns {Promise<Catagory>}
 */
const createCatagory = async (catagoryBody) => {
  
      return await Catagory.create(catagoryBody);
    };
  
const getCatagories = async()=>{
  const catagories = await Catagory.find();

  return catagories;
}

const getCatagoryById = async(catagoryId)=>{
  const catagory = await Catagory.findById(catagoryId);
  return catagory;
}

const updateCatagoryById= async(CatagoryId, updateBody) =>{
  const catagory = await getCatagoryById(CatagoryId);
  if(!catagory){
    throw new ApiError(httpStatus.NOT_FOUND, 'Catagory not found');
  }
  
  Object.assign(catagory, updateBody);
  await catagory.save();
  return catagory;

}

const deleteCatagoryById = async(catagoryId) =>{
  const catagory = await getCatagoryById(catagoryId);
  if(!catagory){
    throw new ApiError(httpStatus.NOT_FOUND, 'Catagory Not found');
  }
  await catagory.deleteOne();
  return catagory;
}

    
    module.exports = {
      createCatagory,
      getCatagories,
    getCatagoryById,
    updateCatagoryById,
    deleteCatagoryById,
  
    }
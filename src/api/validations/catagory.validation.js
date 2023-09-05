const Joi = require("joi");
const {password, objectId, catagory} = require('./custom.validation');
// POST /v1/inquiry
const createCatagory = {
    body: Joi.object({
        name: Joi.string()

    })
}

// GET /v1/inquiry


// GET /v1/inquiry/:inquiryId
const getCatagory = {
    params: Joi.object({
      catagoryId: Joi.string().custom(objectId).required(),
    }),
  
};

// PATCH /v1/inquiry/:inquiryId
const updateCatagory = {
  params: Joi.object({
  catagoryId: Joi.string().custom(objectId).required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
  })

}

// DELETE /v1/inquiry/:inquiryId
const deleteCatagory = {
  params: Joi.object({
    catagoryId: Joi.string().custom(objectId).required(),
  }),
}

module.exports = {
 createCatagory,
  
  getCatagory,
 updateCatagory,
 deleteCatagory
 
};
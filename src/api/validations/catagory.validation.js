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
    query: Joi.object({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(1).max(100),
    status: Joi.string(),
    
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
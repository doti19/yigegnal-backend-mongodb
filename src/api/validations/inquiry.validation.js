const Joi = require("joi");
const {password, objectId} = require('./custom.validation');
// POST /v1/inquiry
const createInquiry = {
    body: Joi.object({
        owner: Joi.object({
              firstName: Joi.string().required(),
              lastName: Joi.string().required(),
              phoneNumber: Joi.number().required(),
              email: Joi.string().email(),
            }),
           
          item: Joi.object({
            catagory: Joi.string().required(),
            lostPlace: Joi.string().required(),
            lostDate: Joi.date().required(),
            detail: Joi.string(),
          }),
           // status: Joi.string().required().valid("Delivered", "Pending", "Found").default("Pending"),
          //  isFound: Joi.boolean().required().default(false),
           // foundedItemId: Joi.when("isFound", {
           //  is: true,
           //  then: Joi.string().custom(objectId),
           //  otherwise: Joi.valid(null),
         
           // }),
           // registeredBy: Joi.string().required()

    })
}

// GET /v1/inquiry
const getInquiries = {
  query: Joi.object({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(1).max(100),
    status: Joi.string(),
    item: Joi.object({
      catagory: Joi.string(),
      lostPlace: Joi.string()
    }),
    owner: Joi.object({
      firstName: Joi.string()
    })
  })
}

// GET /v1/inquiry/:inquiryId
const getInquiry = {
    params: Joi.object({
      inquiryId: Joi.string().custom(objectId),
    }),
  
};

// PATCH /v1/inquiry/:inquiryId
const updateInquiry = {
  params: Joi.object({
  inquiryId: Joi.string().custom(objectId).required()
  }),
  body: Joi.object({
      owner: Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
            phoneNumber: Joi.number(),
            email: Joi.string().email(),
          }),
         
        item: Joi.object({
          catagory: Joi.string(),
          lostPlace: Joi.string(),
          lostDate: Joi.date(),
          detail: Joi.string(),
        }),
        //  status: Joi.string().valid("Delivered", "Pending", "Found").default("Pending"),
        //  isFound: Joi.boolean().default(false),
        //  foundedItemId: Joi.when("isFound", {
        //   is: true,
        //   then: Joi.string().custom(objectId),
        //   otherwise: Joi.valid(null),
       
        //  }),
        //  registeredBy: Joi.string()

  })

}

// DELETE /v1/inquiry/:inquiryId
const deleteInquiry = {
  params: Joi.object({
    inquiryId: Joi.string().custom(objectId),
  }),
}

// Patch /v1/inquiry/status/:inquiryId
const updateInquiryStatus = {
  params: Joi.object({
    inquiryId: Joi.string().custom(objectId),
  }),
  body: Joi.object({
    status: Joi.string().required().valid("Pending", "Found"),
    
    foundedItemId: Joi.when("status", {
     is: Joi.string().valid("Found"),
     then: Joi.string().custom(objectId),
     otherwise: Joi.valid(null),
    }),

  })
}

module.exports = {
  createInquiry,
  getInquiries,
 getInquiry,
 updateInquiry,
 deleteInquiry,
 updateInquiryStatus
};
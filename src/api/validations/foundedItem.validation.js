const Joi = require("joi");
const { catagory, objectId } = require("./custom.validation");

// POST /v1/founded-item
const createFoundedItem = {
  body: Joi.object({
    hasOwner: Joi.boolean().required().default(false),
    owner: Joi.when("hasOwner", {
      is: true,
      then: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        phoneNumber: Joi.number(),
        email: Joi.string().email(),
      }),
      otherwise: Joi.valid(null),
    }),
    item: Joi.object({
      catagory: Joi.string().required(),
      lostPlace: Joi.string(),
      lostDate: Joi.date(),
      detail: Joi.string(),
    }),
    founder: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phoneNumber: Joi.number().required(),
      email: Joi.string().email(),
    }),
    foundedPlace: Joi.string().required(),
    foundedDate: Joi.date().required(),
    // status: Joi.string()
    //   .valid("Delivered", "Not Delivered", "Pending")
    //   .default("Not Delivered"),
    // deliveredBy: Joi.when("status", {
    //   is: Joi.string().valid("Delivered"),
    //   then: Joi.string().required(),
    //   otherwise: Joi.valid(null),
    // }),
    //TODO should i add inquiry id if it is pending
   
  }),
};

// GET /v1/founded-item
const getFoundedItems = {
  query: Joi.object({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(1).max(100),
    status: Joi.string(),
    foundedDate: Joi.object({
      lte: Joi.string()
    })
  }),
};

// GET /v1/founded-item/:foundedItemId
const getFoundedItem ={
  params: Joi.object({
    foundedItemId: Joi.string().custom(objectId),
  }),
};

// PATCH /v1/founded-item/:foundedItemId
const updateFoundedItem = {
  params: Joi.object({
    foundedItemId: Joi.string().custom(objectId).required()
    }),
    body: Joi.object({
      hasOwner: Joi.boolean(),
    owner: Joi.when("hasOwner", {
      is: true,
      then: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        phoneNumber: Joi.number(),
        email: Joi.string().email(),
      }),
      otherwise: Joi.valid(null),
    }),
    item: Joi.object({
      catagory: Joi.string(),
      lostPlace: Joi.string(),
      lostDate: Joi.date(),
      detail: Joi.string(),
    }),
    founder: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      phoneNumber: Joi.number(),
      email: Joi.string().email(),
    }),
    foundedPlace: Joi.string(),
    foundedDate: Joi.date(),
    })
};

// DELETE /v1/founded-item/:foundedItemId
const deleteFoundedItem = {
  params: Joi.object({
    foundedItemId: Joi.string().custom(objectId),
  }),
};

// Patch /v1/founded-item/status/:foundedItemId
const updateFoundedItemStatus = {
  params: Joi.object({
    foundedItemId: Joi.string().custom(objectId),
  }),
  body: Joi.object({
    status: Joi.string().required().valid("Delivered", "Pending", "Not Delivered"),
    hasInquiry: Joi.when("status",{
      is: Joi.string().valid('Pending'),
      then:  Joi.boolean().required().default(false),
      otherwise: Joi.valid(null)
    }),
   
    deliveredBy: Joi.when("status", {
     is: Joi.string().valid("Delivered"),
     then: Joi.string(),
     otherwise: Joi.valid(null),
    }),

    inquiryId: Joi.when("status",{
      is: Joi.string().valid('Pending'),
      then: Joi.when("hasInquiry",{
        is: true,
        then: Joi.string().custom(objectId),
        otherwise: Joi.valid(null)
      }),
      otherwise: Joi.valid(null)
    })

  })
}

module.exports = {
  createFoundedItem,
  getFoundedItems,
  getFoundedItem,
  updateFoundedItem,
  deleteFoundedItem,
  updateFoundedItemStatus
};

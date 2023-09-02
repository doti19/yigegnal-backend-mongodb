const Joi = require('joi');
const {catagory} = require('./custom.validation');

const createFoundedItem={
    body: Joi.object({
      catagory: Joi.string().required(),
      lostPlace:Joi.string(),
      lostDate: Joi.string(),
      detail: Joi.string(),
    })
}

module.exports = {
    createFoundedItem,
};
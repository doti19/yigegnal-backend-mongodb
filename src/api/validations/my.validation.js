//Validation
const Joi = require('joi');

//Register Validation - wrap it in a function as there will be multiple schemas
const registerValidation = data => {

const schema = {
    // name: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()

    }
return Joi.assert(data, schema);

}
// Login Validation

const loginValidation = data => {

    const schema = {
        
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    
        }
    
    return Joi.assert(data, schema);
    
    }

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
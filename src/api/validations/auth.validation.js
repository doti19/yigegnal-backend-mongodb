const Joi = require('joi');
const { password } = require('./custom.validation');

module.exports = {
  // POST /v1/auth/register
  register:  Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required().custom(password),
        role: Joi.string().required(),
    }),
  

  // POST /v1/auth/login
  login: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        ,
    }),
  },

  // GET /v1/auth/logout
  logout: {
    body: Joi.object({
      refreshToken: Joi.string().required(),
    })
  },


  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: Joi.object({
      access_token: Joi.string().required(),
    }),
  },

  // POST /v1/auth/refresh-tokens
  refreshTokens: {
    body: Joi.object({
      // email: Joi.string()
      //   .email()
      //   .required(),
      refreshToken: Joi.string().required(),
    }),
  },

  // POST /v1/auth/forgot-password
  forgotPassword: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
    }),
  },

  // POST /v1/auth/reset-password
  resetPassword: {
    body: Joi.object({
      password: Joi.string().required().custom(password),
    }),
    query: Joi.object({
      // email: Joi.string()
      //   .email()
      //   .required(),
      // password: Joi.string()
      //   .required()
      //   .min(6)
      //   .max(128),
      resetToken: Joi.string().required(),
    }),
  },

  

  // POST /v1/auth/send-verification-email
  sendVerificationEmail: {
    body: Joi.object({
      email: Joi.string()
        .email(),
        // .required(),
    }),
  },

  // POST /v1/auth/verify-email
   verifyEmail: {
    query: Joi.object({
      token: Joi.string().required(),
    }),
  },
};



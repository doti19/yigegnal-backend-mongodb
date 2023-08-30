const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// import .env variables
dotenv.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    EMAIL_HOST: Joi.string().description('server that will send the emails'),
    EMAIL_PORT: Joi.number().description('port to connect to the email server'),
    EMAIL_USERNAME: Joi.string().description('username for email server'),
    EMAIL_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

  const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt:{
    jwtSecret: envVars.JWT_SECRET,
    jwtAccessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
 
  mongo: {
    uri: envVars.NODE_ENV === 'test' ? envVars.MONGO_URI_TESTS : envVars.MONGO_URI,
  },
  logs: envVars.NODE_ENV === 'production' ? 'combined' : 'dev',
  emailConfig: {
    smtp: {
      host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
  },
  auth: {
    
    username: envVars.EMAIL_USERNAME,
    password: envVars.EMAIL_PASSWORD,
  },
  from: envVars.EMAIL_FROM
},
};

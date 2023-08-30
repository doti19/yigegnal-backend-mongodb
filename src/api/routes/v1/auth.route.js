const express = require('express');
// const validate = require('express-validation');
const validator = require('express-joi-validation').createValidator({});
const authValidation = require('../../validations/auth.validation');

const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
// const oAuthLogin = require('../../middlewares/auth').oAuth;
// const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router.post('/register',  authController.register);
router.post('/login', validator.body(authValidation.login.body), authController.login);
router.post('/logout', validator.body(authValidation.logout.body), authController.logout);
router.post('/refresh-tokens', validator.body(authValidation.refreshTokens.body), authController.refreshTokens);
router.post('/forgot-password', validator.body(authValidation.forgotPassword.body), authController.forgotPassword);
router.post('/reset-password', validator.query(authValidation.resetPassword.query), validator.body(authValidation.resetPassword.body), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
// router.post('/verify-email', validator.query(authValidation.verifyEmail.query), authController.verifyEmail);

module.exports = router;


// ######################################################################
// const {
//   register,
//   login,
//   logout,
//   oAuth,
//   refresh,
//   sendPasswordReset,
//   passwordReset,
//   sendVerificationEmail,
//   verifyEmail,
// } = require('../../validations/auth.validation');
// const authValidation = require('../../validations/auth.validation');

// const router = express.Router();

// /**
//  * @api {post} v1/auth/register Register
//  * @apiDescription Register a new user
//  * @apiVersion 1.0.0
//  * @apiName Register
//  * @apiGroup Auth
//  * @apiPermission public
//  *
//  * @apiParam  {String}          email     User's email
//  * @apiParam  {String{6..128}}  password  User's password
//  *
//  * @apiSuccess (Created 201) {String}  token.tokenType     Access Token's type
//  * @apiSuccess (Created 201) {String}  token.accessToken   Authorization Token
//  * @apiSuccess (Created 201) {String}  token.refreshToken  Token to get a new accessToken
//  *                                                   after expiration time
//  * @apiSuccess (Created 201) {Number}  token.expiresIn     Access Token's expiration time
//  *                                                   in miliseconds
//  * @apiSuccess (Created 201) {String}  token.timezone      The server's Timezone
//  *
//  * @apiSuccess (Created 201) {String}  user.id         User's id
//  * @apiSuccess (Created 201) {String}  user.name       User's name
//  * @apiSuccess (Created 201) {String}  user.email      User's email
//  * @apiSuccess (Created 201) {String}  user.role       User's role
//  * @apiSuccess (Created 201) {Date}    user.createdAt  Timestamp
//  *
//  * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
//  */
// router.route('/register')
//   .post(validate.body(register ), authController.register);

// /**
//  * @api {post} v1/auth/login Login
//  * @apiDescription Get an accessToken
//  * @apiVersion 1.0.0
//  * @apiName Login
//  * @apiGroup Auth
//  * @apiPermission public
//  *
//  * @apiParam  {String}         email     User's email
//  * @apiParam  {String{..128}}  password  User's password
//  *
//  * @apiSuccess  {String}  token.tokenType     Access Token's type
//  * @apiSuccess  {String}  token.accessToken   Authorization Token
//  * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken
//  *                                                   after expiration time
//  * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time
//  *                                                   in miliseconds
//  *
//  * @apiSuccess  {String}  user.id             User's id
//  * @apiSuccess  {String}  user.name           User's name
//  * @apiSuccess  {String}  user.email          User's email
//  * @apiSuccess  {String}  user.role           User's role
//  * @apiSuccess  {Date}    user.createdAt      Timestamp
//  *
//  * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
//  * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
//  */
// router.route('/login')
//   .post(validate.body(login.body), authController.login);

// /**
//  * @api {post} v1/auth/refresh-token Refresh Token
//  * @apiDescription Refresh expired accessToken
//  * @apiVersion 1.0.0
//  * @apiName RefreshToken
//  * @apiGroup Auth
//  * @apiPermission public
//  *
//  * @apiParam  {String}  email         User's email
//  * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
//  *
//  * @apiSuccess {String}  tokenType     Access Token's type
//  * @apiSuccess {String}  accessToken   Authorization Token
//  * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
//  * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
//  *
//  * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
//  * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
//  */
// router.route('/refresh-token')
//   .post(validate.body(refresh.body), authController.refresh);

// router.route('/send-password-reset')
//   .post(validate.query(sendPasswordReset.body), authController.sendPasswordReset);

// router.route('/reset-password')
//   .post(validate.query(passwordReset.body), authController.resetPassword);

// router.route('/logout', validate.body(logout.body), authController.logout);

// router.post('/send-verification-email',validate.body(sendVerificationEmail.body), authController.sendVerificationEmail);
// router.post('/verify-email', validate.body(verifyEmail.body), authController.verifyEmail);

// /**
//  * @api {post} v1/auth/facebook Facebook Login
//  * @apiDescription Login with facebook. Creates a new user if it does not exist
//  * @apiVersion 1.0.0
//  * @apiName FacebookLogin
//  * @apiGroup Auth
//  * @apiPermission public
//  *
//  * @apiParam  {String}  access_token  Facebook's access_token
//  *
//  * @apiSuccess {String}  tokenType     Access Token's type
//  * @apiSuccess {String}  accessToken   Authorization Token
//  * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
//  * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
//  *
//  * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
//  * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
//  */
// // router.route('/facebook')
// //   .post(validator.query(oAuth.body), oAuthLogin('facebook'), controller.oAuth);

// /**
//  * @api {post} v1/auth/google Google Login
//  * @apiDescription Login with google. Creates a new user if it does not exist
//  * @apiVersion 1.0.0
//  * @apiName GoogleLogin
//  * @apiGroup Auth
//  * @apiPermission public
//  *
//  * @apiParam  {String}  access_token  Google's access_token
//  *
//  * @apiSuccess {String}  tokenType     Access Token's type
//  * @apiSuccess {String}  accessToken   Authorization Token
//  * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
//  * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
//  *
//  * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
//  * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
//  */
// // router.route('/google')
// //   .post(validator.query(oAuth.body), oAuthLogin('google'), controller.oAuth);

// module.exports = router;

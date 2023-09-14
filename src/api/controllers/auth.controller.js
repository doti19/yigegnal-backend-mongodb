const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const User = require("../models/user.model");
const token = require("../models/token.model");
// const PasswordResetToken = require("../models/passwordResetToken.model");
const { jwtExpirationInterval } = require("../../config/config");
const APIError = require("../errors/api-error");
const emailProvider = require("../services/emails/email.service");
const { TokenExpiredError } = require("jsonwebtoken");
// const { token } = require("morgan");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = token.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
// exports.register = async (req, res, next) => {
//   try {
//     const userData = omit(req.body);
//     const user = await new User(userData).save();
//     const userTransformed = user.transform();
//     const token = generateTokenResponse(user, user.token());

//     res.status(httpStatus.CREATED);
//     return res.json({ token, user: userTransformed });
//   } catch (error) {
//     return next(User.checkDuplicateEmail(error));
//   }

// };
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});
/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
// exports.login = async (req, res, next) => {
// try {
//   const { user, accessToken } = await User.findAndGenerateToken(req.body);
//   const token = generateTokenResponse(user, accessToken);
//   const userTransformed = user.transform();
//   return res.json({ token, user: userTransformed });
// } catch (error) {
//   return next(error);
// }
// };
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const changePassword = catchAsync(async(req, res)=>{
  const {newPassword, oldPassword} = req.body;
  await authService.changePassword(req.user, oldPassword, newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Returns a new jwt when given a valid refresh token
 *
 * @public
 */
// NOTe : add verify the token later
// exports.refresh = async (req, res, next) => {
//   try {
//     const { email, refreshToken } = req.body;
//     const refreshObject = await token.findOneAndRemove({
//       userEmail: email,
//       token: refreshToken,
//     });
//     const { user, accessToken } = await User.findAndGenerateToken({
//       email,
//       refreshObject,
//     });
//     const response = generateTokenResponse(user, accessToken);
//     return res.json(response);
//   } catch (error) {
//     return next(error);
//   }
// };
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  console.log('this is my user');

  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.resetToken, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user.email
  );
  await emailService.sendVerificationEmail(req.user, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

// exports.sendPasswordReset = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email }).exec();

//     if (user) {
//       const passwordResetObj = await PasswordResetToken.generate(user);
//       emailProvider.sendPasswordReset(passwordResetObj);
//       res.status(httpStatus.OK);
//       return res.json("success");
//     }
//     throw new APIError({
//       status: httpStatus.UNAUTHORIZED,
//       message: "No account found with that email",
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.resetPassword = async (req, res, next) => {
//   try {
//     const { email, password, resetToken } = req.body;
//     const resetTokenObject = await PasswordResetToken.findOneAndRemove({
//       userEmail: email,
//       resetToken,
//     });

//     const err = {
//       status: httpStatus.UNAUTHORIZED,
//       isPublic: true,
//     };
//     if (!resetTokenObject) {
//       err.message = "Cannot find matching reset token";
//       throw new APIError(err);
//     }
//     if (moment().isAfter(resetTokenObject.expires)) {
//       err.message = "Reset token is expired";
//       throw new APIError(err);
//     }

//     const user = await User.findOne({
//       email: resetTokenObject.userEmail,
//     }).exec();
//     user.password = password;
//     await user.save();
//     emailProvider.sendPasswordChangeEmail(user);

//     res.status(httpStatus.OK);
//     return res.json("Password Updated");
//   } catch (error) {
//     return next(error);
//   }
// };

//TODO finish this later
// exports.resendLink = catchAsync(async (req, res, next) => {
//   User.findOne({ email: req.body.email }, function (err, user) {
//     // user is not found into database
//     if (!user) {
//       return res
//         .status(400)
//         .send({
//           msg: "We were unable to find a user with that email. Make sure your Email is correct!",
//         });
//     }
//     // user has been already verified
//     else if (user.isVerified) {
//       return res
//         .status(200)
//         .send("This account has been already verified. Please log in.");
//     }
//     // send verification link
//     else {
//       // generate token and save
//       var token = new Token({
//         _userId: user._id,
//         token: crypto.randomBytes(16).toString("hex"),
//       });
//       token.save(function (err) {
//         if (err) {
//           return res.status(500).send({ msg: err.message });
//         }

//         // Send email (use credintials of SendGrid)
//         //     var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
//         //     var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
//         //     transporter.sendMail(mailOptions, function (err) {
//         //        if (err) {
//         //         return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
//         //      }
//         //     return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
//         // });
//       });
//     }
//   });
// });

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
};

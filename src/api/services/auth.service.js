const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../errors/api-error');
const { tokenTypes } = require('../../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // const user = await userService.getUserByEmail(email);
  // if (!user || !(await user.isPasswordMatch(password))) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  // }
  // return user;
  const user = await userService.getUserByEmail(email);

  const err = {
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  };

  if(!user){
    err.message = `The email address is not associated with any account, please register.`;
  } else if(!password){
    err.message = 'Incorrect email or password';
  }
  else {
    if (await user.isPasswordMatch(password)) {
      // if(!user.isEmailVerified){
        
      //   err.message = 'Please verify your email address first.';
      //   throw new ApiError(err);
      // }else{
       

        return  user;

        
      // }
    }
    err.message = 'Incorrect email or password';
  
  
  } 
  
  throw new ApiError(err);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError({status: httpStatus.NOT_FOUND, message:'Token Not found'});
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);

    if (!user) {
      throw new ApiError({status: httpStatus.NOT_FOUND, message: "please register" });
    }
    await refreshTokenDoc.deleteOne();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError({status: httpStatus.UNAUTHORIZED, message: 'Please authenticate: ' + error});
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    console.log('heyooo');
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const changePassword = async(myUser, oldPassword, newPassword)=>{
  const err = {
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  };
  try{
    const user = await userService.getUserById(myUser.id);
    if(!user){
      console.log('no user found with that id');
      throw new Error();
    }
    console.log(oldPassword);
    if (await user.isPasswordMatch(oldPassword)) {
      console.log('i should be here');
    await userService.updateUserById(user.id, {password: newPassword});
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
} else{

err.message = 'Incorrect password';
console.log('incorrect password');
throw new ApiError(err);
}

  }catch(error){
    console.log(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password change Failed');
  }
}

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user ) {
      throw new ApiError({status: httpStatus.NOT_FOUND, message:'couldnt find user'});
    }
    if(user.isEmailVerified){
      
      throw new ApiError({status: httpStatus.NOT_ACCEPTABLE, message: 'account is already verified'});
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError({status:httpStatus.UNAUTHORIZED, message:'Email verification failed' + error});
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  changePassword
};

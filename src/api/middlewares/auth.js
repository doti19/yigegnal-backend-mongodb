const passport = require('passport');
const { UNAUTHORIZED, FORBIDDEN } = require('http-status');
const  ApiError = require('../errors/api-error');
const { roleRights } = require('../../config/roles');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  const error = err||info;
  if(err){
    return reject(new ApiError({status: UNAUTHORIZED, message: 'session expired, please login again '}))
  }
else if(info){
  return reject(new ApiError({status: UNAUTHORIZED, message: 'You need to login to perform this operation'}))
 
}
  if (!user) {
    return reject(new ApiError({status: UNAUTHORIZED, message:'Please register first'}));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};
const auth = (...requiredRights) => async (req, res, next) => {
  
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

const restrictTo = (roles) => 
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError({status: FORBIDDEN,message:"you don`t have permission to perform this action"})
      );
    }
    next();
  
};
const emailVerified = () => 
  (req, res, next) => {
    
    if (!req.user.isEmailVerified) {
      return next(
        new ApiError({status: FORBIDDEN,message:"Please verify your email first"})
      );
    }
    next();
  
};
module.exports = {
  auth,
  restrictTo,
  emailVerified,
}
// module.exports = auth;

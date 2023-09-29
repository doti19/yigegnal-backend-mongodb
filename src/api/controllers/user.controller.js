const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../errors/api-error');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req.user);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'isEmailVerified']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const search = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['name', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.search(req.params.keyword); 
  // const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getMe = catchAsync(async(req, res)=>{
  res.send(req.user);
});

const getDeliveryUsers = catchAsync(async(req, res)=>{
    const filter = pick(req.query, [, 'role'], 'role=delivery');
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const result = await userService.getDeliveryUsers(filter, options);
    res.send(result);
});

const getDeliveryUser = catchAsync(async(req, res)=>{
  const result = await userService.getDeliveryUser(req.params.userId);
  res.send(result);
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  getDeliveryUsers,
  getDeliveryUser,
  updateUser,
  deleteUser,
  search,
  getMe,
};







//####################################################################
// const httpStatus = require('http-status');
// const { omit } = require('lodash');
// const User = require('../models/user.model');

// /**
//  * Load user and append to req.
//  * @public
//  */
// exports.load = async (req, res, next, id) => {
//   try {
//     const user = await User.get(id);
//     req.locals = { user };
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// };

// /**
//  * Get user
//  * @public
//  */
// exports.get = (req, res) => res.json(req.locals.user.transform());

// /**
//  * Get logged in user info
//  * @public
//  */
// exports.loggedIn = (req, res) => res.json(req.user.transform());

// /**
//  * Create new user
//  * @public
//  */
// exports.create = async (req, res, next) => {
//   try {
//     const user = new User(req.body);
//     const savedUser = await user.save();
//     res.status(httpStatus.CREATED);
//     res.json(savedUser.transform());
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// };

// /**
//  * Replace existing user
//  * @public
//  */
// // exports.replace = async (req, res, next) => {
//   // try {
//   //   const { user } = req.locals;
//   //   const newUser = new User(req.body);
//   //   const ommitRole = user.role !== 'admin' ? 'role' : '';
//   //   const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

//   //   await user.updateOne(newUserObject, { override: true, upsert: true });
//   //   const savedUser = await User.findById(user._id);

//   //   res.json(savedUser.transform());
//   // } catch (error) {
//   //   next(User.checkDuplicateEmail(error));
//   // }
// // };

// /**
//  * Update existing user
//  * @public
//  */
// exports.update = (req, res, next) => {
//   const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
//   const updatedUser = omit(req.body, ommitRole);
//   const user = Object.assign(req.locals.user, updatedUser);

//   user.save()
//     .then((savedUser) => res.json(savedUser.transform()))
//     .catch((e) => next(User.checkDuplicateEmail(e)));
// };

// /**
//  * Get user list
//  * @public
//  */
// exports.list = async (req, res, next) => {
//   try {
//     const users = await User.list(req.query);
//     const transformedUsers = users.map((user) => user.transform());
//     res.json(transformedUsers);
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * Delete user
//  * @public
//  */
// exports.remove = (req, res, next) => {
//   const { user } = req.locals;

//   user.remove()
//     .then(() => res.status(httpStatus.NO_CONTENT).end())
//     .catch((e) => next(e));
// };

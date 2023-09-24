const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../errors/api-error');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, user) => {
  console.log(user.role);
  if(user.role=='super_admin' || user.role=='admin') {
    
   

  if(user.role=='admin'&& (userBody.role=='admin' ||userBody.role=='super_admin')){
    throw new ApiError({status: httpStatus.FORBIDDEN, message: 'you cant create a user with that role'}); 

  }
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError({status: httpStatus.BAD_REQUEST, message:'Email already taken', isPublic: true});
  }


  return User.create(userBody);
   }else{
    throw new ApiError({status: httpStatus.FORBIDDEN, message: 'you cant create a user'}); 
   }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  // console.log('yo '+ {...filter} +  ' '+ {...options});
  const users = await User.paginateIt(filter, options);

  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};

const getDeliveryUsers = async(filter, options)=>{
  // const foundedItems = await FoundedItem.paginateIt(filter, options);
 
  const users = await User.find({}).where({
    'role': 'delivery',
    'isEmailVerified': true,
  })
  return users;
}


const search = async(keyword)=>{
const result = User.find(
  {
    "$or":[
      {email: {$regex: keyword}},
    ]
  }
) ;
  return result;
}


module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getDeliveryUsers,
  updateUserById,
  deleteUserById,
  search,

};

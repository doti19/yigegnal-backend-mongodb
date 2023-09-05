const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwtSimple = require('jwt-simple');
const {v4: uuidv4} = require('uuid');
const APIError = require('../errors/api-error');
const { env, jwt } = require('../../config/config');
const {roles} = require('../../config/roles');
const { toJSON, paginate } = require('./plugins');

/**
* User Roles
*/
// const roles = ['user', 'admin'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('Invalid email');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate(value){
      if(!value.match(/\d/)|| !value.match(/[a-zA-Z]/)){
        throw new Error('Password must contain atleast one letter and one number');
      }
    },
    private: true, //used by the toJson plugin
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  services: {
    facebook: String,
    google: String,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'db_analysist', 'delivery'],
    required: true,
  },
  picture: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  // token() {
  //   const payload = {
  //     exp: moment().add(jwt.jwtExpirationInterval, 'minutes').unix(),
  //     iat: moment().unix(),
  //     sub: this._id,
  //   };
  //   return jwtSimple.encode(payload, jwt.jwtSecret);
  // },

  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {
 paginateIt,
  /**
  * Check if email is taken
  * @param {string} email - The user's email
  * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
  * @returns {Promise<boolean>}
  */
    async isEmailTaken (email, excludeUserId) {
   const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
   
   return !!user;
 },

  // #########################################

  roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  // async get(id) {
  //   let user;

  //   if (mongoose.Types.ObjectId.isValid(id)) {
  //     user = await this.findById(id).exec();
  //   }
  //   if (user) {
  //     return user;
  //   }

  //   throw new APIError({
  //     message: 'User does not exist',
  //     status: httpStatus.NOT_FOUND,
  //   });
  // },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  // async findAndGenerateToken(options) {
  //   const { email, password, refreshObject } = options;
  //   if (!email) throw new APIError({ message: 'An email is required to generate a token' });

  //   const user = await this.findOne({ email }).exec();
  //   const err = {
  //     status: httpStatus.UNAUTHORIZED,
  //     isPublic: true,
  //   };
  //   if(!user){
  //     err.message = `The email address ${email} is not associated with any account, please register.`
  //   }
  //   else if (password) {
  //     if (await user.passwordMatches(password)) {
  //       if(!user.isEmailVerified){
          
  //         err.message = 'Please verify your email address first.';
  //         throw new APIError(err);
  //       }else{
          
  //         return { user, accessToken: user.token() };
  //       }
  //     }
  //     err.message = 'Incorrect email or password';
  //   } else if (refreshObject && refreshObject.userEmail === email) {
  //     if (moment(refreshObject.expires).isBefore()) {
  //       err.message = 'Invalid refresh token.';
  //     } else {
  //       return { user, accessToken: user.token() };
  //     }
  //   } else {
  //     err.message = 'Incorrect email or refreshToken';
  //   }
  //   throw new APIError(err);
  // },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  // list({
  //   page = 1, perPage = 30, name, email, role,
  // }) {
  //   const options = omitBy({ name, email, role }, isNil);

  //   return this.find(options)
  //     .sort({ createdAt: -1 })
  //     .skip(perPage * (page - 1))
  //     .limit(perPage)
  //     .exec();
  // },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  // checkDuplicateEmail(error) {
  //   if (error.name === 'MongoError' && error.code === 11000) {
  //     return new APIError({
  //       message: 'Validation Error',
  //       errors: [{
  //         field: 'email',
  //         location: 'body',
  //         messages: ['"email" already exists'],
  //       }],
  //       status: httpStatus.CONFLICT,
  //       isPublic: true,
  //       stack: error.stack,
  //     });
  //   }
  //   return error;
  // },

  async oAuthLogin({
    service, id, email, name, picture,
  }) {
    const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture,
    });
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);

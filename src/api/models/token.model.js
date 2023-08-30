const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');
const { toJSON } = require('./plugins');
const {tokenTypes} = require('../../config/tokens');

/**
 * Token Schema
 * @private
 */
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
    required: true,
  },
  // userEmail: {
  //   type: 'String',
  //   ref: 'User',
  //   required: true,
  // },
  blacklisted: {
    type: Boolean,
    default: false,
  },
  expires: { type: Date },
},
{
  timestamps: true,
}
);

  // add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);


tokenSchema.statics = {
  /**
   * Generate a token object and saves it into the database
   *
   * @param {User} user
   * @returns {Token}
   */
  generate(user) {
    const userId = user._id;
  //TODO shouldn't i add blacklisted int the tokenObject
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    const type = tokenTypes.REFRESH;
    const tokenObject = new Token({
      token, userId,  expires, type
    });
    tokenObject.save();
    return tokenObject;
  },

};

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;

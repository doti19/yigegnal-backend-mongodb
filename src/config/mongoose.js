const mongoose = require("mongoose");
const logger = require("./logger");
const { mongo, env } = require("./config");
// const { Promise } = require('bluebird');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env

if (env === "development") {
  mongoose.set("debug", true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */

exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      
    })
    .then(() => logger.info('mongoDB connected Successfully...'));
  return mongoose.connection;
};

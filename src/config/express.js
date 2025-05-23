const express = require('express');
// const morgan = require('./morgan');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const expressSession = require('express-session');
// const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const routes = require('../api/routes/v1');
const { logs, jwt, env } = require('./config');
const strategies = require('./passport');
const error = require('../api/middlewares/error');
const {authLimiter} = require('../api/middlewares/rateLimiter');
const mongoose = require("mongoose");

/**
* Express instance
* @public
*/
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// if (env !== 'test') {
//     app.use(morgan.successHandler);
//     app.use(morgan.errorHandler);
//   }

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// // sanitize request data
// app.use(xss());
// app.use(mongoSanitize());

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(expressSession({ 
    secret: jwt.jwtSecret,
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
// app.use(passport.session());
passport.use('jwt', strategies.jwtStrategy);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//     app.use('/v1/auth', authLimiter);
//   }
  


// mount api v1 routes
app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;

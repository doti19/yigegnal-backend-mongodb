const Joi = require('joi');
const {password, objectId} = require('./custom.validation');



  // POST /v1/users
  const createUser= {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().custom(password),
      name: Joi.string().max(128),
      role: Joi.string().valid("super_admin", "admin","db_analysist", "delivery").required()

    }),
  };
  // GET /v1/users
  const getUsers= {
    query: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
      isEmailVerified: Joi.string(),
      // perPage: Joi.number().integer().min(1).max(100),
      // email: Joi.string(),
      // role: Joi.array().items(Joi.string().valid("admin", "user"))
      // role:  Joi.string().valid(User.roles).required(),
    }),
    // body: Joi.object({
    //   userId: Joi.string().required()
    // })
  };

 // GET /v1/users/:userId
 const  getUser = {
    params: Joi.object({
      userId: Joi.string().custom(objectId),
    }),
  };

  

  // PUT /v1/users/:userId
  // replaceUser: {
  //   body: Joi.object({
  //     email: Joi.string().email().required(),
  //     password: Joi.string().custom(password).required(),
  //     name: Joi.string().max(128),
  //     role: Joi.array().items(Joi.string().valid("admin", "user"))

  //   }),
  //   params: Joi.object({
  //     userId: Joi.string().custom(objectId).required(),
  //   }),
  // },

  // PATCH /v1/users/:userId
 const  updateUser= {
    params: Joi.object({
      userId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string().max(128),
      lastName: Joi.string().max(128),
      role: Joi.string().valid("db_analysist", "delivery")

    }).min(1),
  };

  // DELETE /v1/users/:userId
  const deleteUser = {
    params: Joi.object({
      userId: Joi.string().custom(objectId),
    }),
  };

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
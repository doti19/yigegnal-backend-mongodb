//make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const {port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

//open mongoose connection
mongoose.connect();

//listen to requests
app.listen(port, ()=> logger.info(`server started on port ${port} (${env})`));

// const express = require("express");
// const cors = require("cors");
// const cookieSession = require("cookie-session");

// const db = require("./app/models");
// const dbConfig = require("./app/config/auth.config");
// const app = express();

// var corsOptions = {
//     origin : "http://localhost:8081"
// };

// app.use(cors(corsOptions));



// app.use(
//     cookieSession({
//         name: "mehari-session",
//         keys: ["MEHARI_SECRET"], //should use as secret environment variable
//         httpOnly: true      
//     })
// );

// const Role = db.role;

// db.mongoose.connect(`mongodb://0.0.0.0:27017/yigegnal`, {

//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(()=>{
//     console.log("Successfully connect to MongoDB.");
//     initial();
// }).catch(err=>{
//     console.error("Connection Error, doti:- ", err);
//     process.exit();
// });

// async function initial() {
//     const count = await Role.estimatedDocumentCount();
//     if (count === 0) {
//       await new Role({ name: "user" }).save();
//       console.log("added 'user' to roles collection");
//       await new Role({ name: "moderator" }).save();
//       console.log("added 'moderator' to roles collection");
//       await new Role({ name: "admin" }).save();
//       console.log("added 'admin' to roles collection");
//     }
//   await Role.estimatedDocumentCount().then((count)=>{
//     if(count==0){
//         new Role({
//             name: "user"
//         }).save(err =>{
//             if(err){
//                 console.log("error", err);
//             }
//             console.log("added 'user' to roles collection");
//         });

//         new Role({
//             name: "moderator"
//         }).save(err =>{
//             if(err){
//                 console.log("error", err);
//             }
//             console.log("added 'moderator' to roles collection");
//         });
//         new Role({
//             name: "admin"
//         }).save(err=>{
//             if(err){
//                 console.log('error', err);
//             }
//             console.log("added 'admin' to roles collection");
//         });
//     }
    
//   }).catch(err=> console.log('hellow'));
   
//    Role.estimatedDocumentCount((err, count)=>{
//         if(!err && count == 0){
//             new Role({
//                 name: "user"
//             }).save(err =>{
//                 if(err){
//                     console.log("error", err);
//                 }
//                 console.log("added 'user' to roles collection");
//             });

//             new Role({
//                 name: "moderator"
//             }).save(err =>{
//                 if(err){
//                     console.log("error", err);
//                 }
//                 console.log("added 'moderator' to roles collection");
//             });
//             new Role({
//                 name: "admin"
//             }).save(err=>{
//                 if(err){
//                     console.log('error', err);
//                 }
//                 console.log("added 'admin' to roles collection");
//             });
//         }
//     });
// }

// simple route
// app.get("/", (req, res) => {
//     res.json({
//         message: "Welcome to yigegnal application."
//     });
// });

// routes 
// require('./app/routes/auth.routes')(app);
// require('./app/routes/user.routes')(app);

// set port, listen for requests
// const PORT = process.env.PORT ||  3000;
// app.listen(PORT, ()=>{
//     console.log(`Server is running on port ${PORT}`);
// });



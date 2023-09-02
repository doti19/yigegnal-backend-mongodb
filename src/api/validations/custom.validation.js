const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
  };
  
  const password = (value, helpers) => {
    if (value.length < 8) {
      return helpers.message('password must be at least 8 characters');
    }
    // if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    //   return helpers.message('password must contain at least 1 letter and 1 number');
    // }
    return value;
  };
const {Catagory} = require("../models");
  
  const catagory =  async(value, helpers)=>{
    const data =  await Catagory.isCatagoryFound(value);
    
    // if(data.every(el => el.name==value)){
    //   return value;
    // }
    
    if(data) return value;
    // Catagory.findOne({name: value}).then((el)=> {return value;});
    console.log('it didnt return');

return helpers.message('invalid catagory name yo');
   
    

  }

  module.exports = {
    objectId,
    password,
    catagory,
  };
  
const { string } = require("joi");
const mongoose = require("mongoose");
const validator = require("validator");
const catagorySchema = require("./category.model").Schema;
const { toJSON, paginate } = require('./plugins');
const FoundedItemSchema = new mongoose.Schema(
  {
    hasOwner: {
      type: Boolean,
      required: true,
      default: false,
    },
    owner: {
      firstName: {
        type: String,
        required: function(){return this.hasOwner;}
      },
      lastName: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('Invalid email');
      }
    }
      }
    },
    item: {
      catagory: {
        type: String,
        required: true,
      },
      lostPlace: {
        type: String,
      },
      lostDate: {
        type: Date,
      },
      detail: {
        type: String,
      },
    },
    founder: {
      firstName: {
       type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      //TODO add either phone or email should be required here
    },
    email:{
      type: String,
        match: /^\S+@\S+\.\S+$/,
        lowercase: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('Invalid email');
      }
    }
    }
  },
  foundedPlace: {
    type: String,
    required: true
  },
  foundedDate: {
    type: Date,
    required: true,
  },
    status: {
      type: String,
      enum: ['Delivered', 'Not Delivered', 'Pending'],
      default: 'Pending',
      required: true,
    },
    deliveredBy: {
      type: String,
      required: function(){return this.status=='Delivered'}
    },
    registeredBy: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: function(){return this.status=='Delivered'},
      
    }
    
    
  },
  { timestamps: true }
);
// add plugin that converts mongoose to json
FoundedItemSchema.plugin(toJSON);
FoundedItemSchema.plugin(paginate);
FoundedItemSchema.statics = {
  paginateIt
}
module.exports = mongoose.model("FoundItem", FoundedItemSchema);

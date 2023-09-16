const { string } = require("joi");
const mongoose = require("mongoose");
const validator = require("validator");
const catagorySchema = require("./category.model").Schema;
const { toJSON, paginate } = require('./plugins');
const {customAlphabet} = require("nanoid/non-secure");
const nanoid = customAlphabet('1234567890', 6);
const FoundedItemSchema = new mongoose.Schema(
  {
    hasOwner: {
      type: Boolean,
      required: true,
      // default: false,
    },
    foundedItemId: {
      type: String,
      unique: true,
     required: true, default: nanoid(),
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
      default: 'Not Delivered',
      // required: true,
    },
    //TODO  make this point to the delivery guys later
    deliveredBy: {
      type: String,
      required: function(){return this.status=='Delivered'}
    },

     deliveryDate: {
      type: Date,
    // default: Date.now(),
      required: function(){return this.status=='Delivered'},
      
    },

    registeredBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      
    },
    hasInquiry: {
      type: Boolean,
    default: false,
      required: function(){return this.status=='Pending'}
    },

    inquiryId:{
     type: mongoose.Schema.ObjectId,
      ref: "Inquiry",
      required: function(){ return (this.status=='Pending' && this.hasInquiry==false) },
  },
   momentDate: String,
    momentDateOnly: String, 
},
{ timestamps: {createdAt: true, updatedAt: true} , toJson: { virtuals: true }, toObj: { virtuals: true }}
);
// add plugin that converts mongoose to json
FoundedItemSchema.plugin(toJSON);
FoundedItemSchema.plugin(paginate);
FoundedItemSchema.statics = {
  paginateIt
}
module.exports = mongoose.model("FoundItem", FoundedItemSchema);

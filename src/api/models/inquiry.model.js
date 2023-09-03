const mongoose = require("mongoose");
const validator = require("validator");
const catagorySchema = require("./category.model").Schema;
const { toJSON, paginate } = require('./plugins');

const InquirySchema = new mongoose.Schema({
     item: {
      catagory: {
        type: String,
        required: true,
      },
      lostPlace: {
        type: String,
        required: true,

      },
      lostDate: {
        type: Date,
        required: true,

      },
      detail: {
        type: String,
      },
    },
    owner: {
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
    status: {
        type: String,
        enum: ['Delivered', 'Pending', 'Found'],
        required: true,
        default: 'Pending',
    },
    isFound: {
         type: Boolean,
      required: true,
      default: false,
    },
    foundedItemId: {
        type: mongoose.Schema.ObjectId,
        ref: "FoundItem",
        required: function(){ return this.isFound},
    },
    registeredBy: {
        type: String,
        required: true,
    }, 
    
},
{ timestamps: true }
);

InquirySchema.plugin(toJSON);
InquirySchema.plugin(paginate);

InquirySchema.statics = {
  paginateIt
}

module.exports = mongoose.model("Inquiry", InquirySchema);
const mongoose = require("mongoose");
const validator = require("validator");
const catagorySchema = require("./category.model").Schema;
const { toJSON, paginate } = require('./plugins');
const {customAlphabet} = require("nanoid/non-secure");
const nanoid = customAlphabet('1234567890', 6);
const InquirySchema = new mongoose.Schema({
     item: {
      inquiryId: {
      type: String,
      unique: true,
     required: true, default: nanoid(),
    },
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
        required: function(){return (this.status == 'Found' || this.status=='Delivered' )},
      },
      lastName: {
        type: String,
        required: function(){return (this.status == 'Found' || this.status=='Delivered' )},

      },
      phoneNumber: {
        type: String,
        required: function(){return (this.status == 'Found' || this.status=='Delivered' )},

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
        enum: ['Pending', 'Found'],
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
    momentDate: String,
    momentDateOnly: String, 
    
},
{ timestamps: {createdAt: true, updatedAt: true} , toJson: { virtuals: true }, toObj: { virtuals: true }}
);
InquirySchema.set('timestamps', true);
InquirySchema.plugin(toJSON);
InquirySchema.plugin(paginate);

InquirySchema.statics = {
  paginateIt
}

module.exports = mongoose.model("Inquiry", InquirySchema);
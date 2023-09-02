const { string } = require("joi");
const mongoose = require("mongoose");
const validator = require("validator");
const catagorySchema = require("./category.model").Schema;
const { toJSON, paginate } = require('./plugins');
const FoundedItemSchema = new mongoose.Schema(
  {

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
  { timestamps: true }
);
// add plugin that converts mongoose to json
FoundedItemSchema.plugin(toJSON);
FoundedItemSchema.plugin(paginate);
module.exports = mongoose.model("Item", FoundedItemSchema);

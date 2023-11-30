const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const CatagorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    momentDate: String,
    momentDateOnly: String,
},
{ timestamps: {createdAt: true, updatedAt: true} , toJson: { virtuals: true }, toObj: { virtuals: true }}
);
CatagorySchema.set('timestamps', true);

CatagorySchema.plugin(toJSON);
CatagorySchema.plugin(paginate);
CatagorySchema.statics ={
    
    async isCatagoryFound(name){
        const catagory = await this.findOne({name});
        return !!catagory;
    },
  paginateIt

}




module.exports = mongoose.model('Catagory', CatagorySchema)
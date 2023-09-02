const mongoose = require('mongoose');

const CatagorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,

    }
});
CatagorySchema.statics ={
    
    async isCatagoryFound(name){
        const catagory = await this.findOne({name});
        return !!catagory;
    }
}


module.exports = mongoose.model('Catagory', CatagorySchema)
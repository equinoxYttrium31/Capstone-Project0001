const mongoose = require('mongoose')
const { Schema } = mongoose

const CellGroup = new Schema({
    cellgroupName: {
        type:String, 
        unique:true, 
        required: true
    },
    cellgroupLeader:{
        type:String,
        required:true
    }
});

const CellGroupModel = mongoose.model('CellGroup', CellGroup, 'CellGroup');
module.exports = CellGroupModel;
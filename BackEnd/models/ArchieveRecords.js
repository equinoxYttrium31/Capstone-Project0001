const mongoose = require('mongoose')
const { Schema } = mongoose

const addressArchieveSchema = new mongoose.Schema({
    baseAddress: { type: String, required: true, default: null },
    barangay: { type: String, required: true, default: null },
    city: { type: String, required: true, default: null },
    province: { type: String, required: true, default: null },
});

const ArchieveUser = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    }, 
    password: String,
    birthDate: Date,
    profilePic: { type: String, default: null },
    address: addressArchieveSchema,
    CellNum: { type: String, default: null },
    TelNum: {
        type: String, 
        default: null
    },
    CellLead: { type: String, default: null },
    NetLead: { type: String, default: null },
    gender: {type: String, default: null},
    dateArchieved: {type: String, default: null},
})

const ArchieveUserModel = mongoose.model('ArchieveUser', ArchieveUser, 'ArchieveUser');

module.exports = ArchieveUserModel;
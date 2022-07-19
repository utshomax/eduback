const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const studentRes = new mongoose.Schema(
    {
        roll: {type:String,unique:true},
        year:String,
        phone_no:String,
        password: String,
        name:String,
        batchid:String,
        show:Boolean,
        result:[],
    }
)
studentRes.plugin(uniqueValidator);
module.exports = studentRes
const mongoose = require('mongoose')
const identitycounter = new mongoose.Schema({
    count:Number,
    model:{type:String,unique:true},
    field:String
})
module.exports = identitycounter
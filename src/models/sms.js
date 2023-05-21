const mongoose = require('mongoose')
const smsData = new mongoose.Schema({
    id:Number,
    to:String,
    msg:String,
    status:String,
    count:Number,
    ref:String,
})

module.exports = smsData
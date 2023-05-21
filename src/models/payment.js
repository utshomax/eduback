const mongoose = require('mongoose')
const payData = new mongoose.Schema({
    id:Number,
    studentid:Number,
    batchname:String,
    name:String,
    paid:Number,
    due:Number,
    ref:String,
    month:String,
    discount:Number,
    date:String
})

module.exports = payData
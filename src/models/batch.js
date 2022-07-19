const mongoose = require('mongoose')
const batchData = new mongoose.Schema({
    id:Number,
    name:String,
    status:String,
    startmonth:String,
    startdate:String,
    currentdate:String,
    fee:Number,
    admissionfee:Number,
    exams:[]
})
module.exports = batchData
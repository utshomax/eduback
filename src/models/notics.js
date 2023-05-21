
const mongoose = require('mongoose')
const noticeData = new mongoose.Schema(
    {
       id:Number,
       title:String,
       n_details:String,
       date:String,
       n_file:String,
       n_type:String,
 
    }
)

module.exports = noticeData
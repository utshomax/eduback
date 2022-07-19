
const mongoose = require('mongoose')
const notiData = new mongoose.Schema(
    {
       id:Number,
       msg:Object,
       date:String,
       isAdmin:Boolean,
       type:String,
       paymentinfo:{
           tranxid:String,
           mode:String,
           paid:Number,
           datetime:String,
           due:Number,
           month:String,
       },
       senderid:Number,
       sendername:String,
       batchid:Number,
       batchname:String,
       status:String,
    }
)

module.exports = notiData
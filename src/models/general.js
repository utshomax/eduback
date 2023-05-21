const mongoose = require('mongoose');
const general = new mongoose.Schema({
  msg_left: {
    type: Number,
    required: true,
  },
  trial: String,
  cid: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  debug: {
    type: Boolean,
    required: true,
  },
  due: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  last_payment_date: {
    type: String,
  },
  //payments
  payment: [
    {
      date: String,
      month: String,
      trnxid: String,
      amount: Number,
      type: String,
      status: String,
    },
  ],
  // Support
  support: [
    {
      sub: String,
      msg: String,
      from: String,
      to: String,
      cid: String,
      time: String,
      show: Boolean,
      highlight: Boolean,
    },
  ],
});
module.exports = general;

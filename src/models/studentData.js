const mongoose = require('mongoose');
const studentData = new mongoose.Schema({
  roll: String,
  password: { type: String, required: true },
  name: { type: String, required: true },
  f_name: { type: String },
  m_name: { type: String, required: true },
  dob: String,
  due: Number,
  batchid: Number,
  batchname: String,
  image: String,
  address: String,
  phone_no: { type: String, required: true },
  year: String,
});

module.exports = studentData;

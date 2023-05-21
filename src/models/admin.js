const mongoose = require('mongoose');
const adminData = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  t_id: {
    type: String,
    required: true,
  },
  last_login: String,
  power: {
    type: String,
    required: true,
  }

});

module.exports = adminData;

const mongoose = require('mongoose');
const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  dbURI: {
    type: String,
    required: true,
  },
  notice: [
    {
      id: String,
      msg: String,
      highlight: Boolean,
      isCancelable: Boolean,
    },
  ],
});

tenantSchema.index({
  tenantId: 1,
});

module.exports = mongoose.model('Tenant', tenantSchema);

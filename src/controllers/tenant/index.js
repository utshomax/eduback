const {
  getAllTenantConnection,
  getdb,
  getAdminConnection,
  connectAllDb,
} = require('../../dbcontroller/dbutil');
const { getOneTenant } = require('../../services/tenant');

const sendGlobalNotice = async function (req, res) {
  const { msg, isCancelable } = req.body;
  let connection = getAdminConnection();
  let payload = {
    msg: msg,
    highlight: true,
    isCancelable: isCancelable,
  };
  const Admin = await connection.model('Tenant');
  const result = await Admin.updateMany(
    {},
    { $push: { notice: payload } },
    { new: true }
  );
  res.send(result);
};

const getNotice = async function (req, res) {
  let cid = req.params.cid;
  let admindb = getAdminConnection();
  let tenant = await getOneTenant(admindb, cid);
  if (tenant.notice) {
    res.send(tenant.notice);
  } else {
    res.send([]);
  }
};
//Send notice to individual tenant
const sendNotice = async function (req, res) {
  let cid = req.params.cid;
  let data = req.body;
  let connection = getAdminConnection();
  let Admin = connection.model('Tenant');
  let result = await Admin.findOneAndUpdate(
    { cid: cid },
    { $push: { notice: data } },
    { new: true }
  );
  res.send(result);
};

//Communicating with users - Support Section

const sendMessage = async function (req, res) {
  let { from, to, msg, time, cid, sub } = req.body;
  let connection = getdb(cid);
  let payload = {
    sub: sub,
    msg: msg,
    cid: cid,
    from: from,
    to: to,
    time: time,
    show: true,
    highlight: true,
  };
  const result = await connection.general.findOneAndUpdate(
    { cid: cid },
    { $push: { support: payload } },
    { new: true }
  );
  return result;
};

//Highlight A Notice
const togglehighlight = async function (req, res) {
  let id = req.params.id;
  let value = req.params.value;
  let connection = getAdminConnection();
  const Tenant = connection.model('Tenant');
  const result = await Tenant.updateMany(
    { 'notice._id': id },
    { $set: { 'notice.$.highlight': value } },
    { new: true }
  );
  res.send(result);
};

//For Madvert
//get all support message from the database
const getAllSupportMessage = async function (req, res) {
  let connections = getAllTenantConnection();
  let messages = [];
  for (prop in connections) {
    console.log(prop);
    const User = await connections[prop].con.models.adminData.find({});
    User.forEach((element) => {
      if (element.support) {
        messages.push({ [element.cid]: element.support });
      }
    });
    console.log(messages);
  }

  res.send(messages);
};
//SMS recharge
const doRecharge = async function (req, res) {
  let cid = req.params.cid;
  let amount = req.params.amount;
  let con = getdb(cid);
  let result = await con.general.updateMany({}, { $inc: { msg_left: amount } });
  res.send(result);
};

//Setting up a tenant general settings
const setSettings = async function (req, res) {
  let cid = req.params.cid;
  let data = req.body;
  let connection = getdb(cid);
  let result = await connection.general.findOneAndUpdate({ cid: cid }, data, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  res.send(result);
};

//Getting a tenant general settings
const getSettings = async function (req, res) {
  let con = getdb(req.params.cid);
  let result = await con.general.findOne({ cid: req.params.cid });
  res.send(result);
};

//Reconnect option after a tenant is created
const reconnect = async function (req, res) {
  try {
    await connectAllDb();
    res.send({ success: true });
  } catch (e) {
    res.send({ success: false, error: e });
  }
};
module.exports = {
  sendGlobalNotice,
  getNotice,
  sendMessage,
  togglehighlight,
  getAllSupportMessage,
  doRecharge,
  setSettings,
  reconnect,
  getSettings,
  sendNotice,
};

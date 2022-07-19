const db = require('../dbcontroller/dbutil');
const smsController = require('../controllers/smsController');

exports.getPayhistory = async (req, rep) => {
  try {
    const result = await db.getdb(req.params.cid).payData.find();
    return result;
  } catch (err) {
    console.log(err);
  }
};

exports.pay = async (req, reply) => {
  try {
    var data = req.body;
    var tpaid = Number(data.paid) + Number(data.discount);
    const payment = await db
      .getdb(req.params.cid)
      .studentData.findOneAndUpdate(
        { roll: data.studentid },
        { $inc: { due: -tpaid } },
        { new: true }
      );
    if (Number(payment.due) < Number(data.due)) {
      data['due'] = Number(payment.due);
    }
    data['batchname'] = payment.batchname;
    data['date'] = data.date;
    const res = new db.getdb(req.params.cid).payData(data);
    var rtos = res.save();
    var msg = `Dear ${payment.name},
${data.paid} Taka has been received. Month : ${data.month}. Due: ${
      payment.due
    }. 
Thanks,
-${db.getName(req.params.cid)}.`;
    var to = payment.phone_no.toString();
    smsController.smsAction(to, msg);
    return rtos;
  } catch (err) {
    console.log(err);
  }
};

exports.getDues = async (req, reply) => {
  try {
    var res = await db
      .getdb(req.params.cid)
      .studentData.find({ due: { $gt: 0 } });
    return res;
  } catch (err) {
    console.log(err);
  }
};
exports.notifyall = async (req, reply) => {
  try {
    var res = await db
      .getdb(req.params.cid)
      .studentData.find({ due: { $gt: 0 } });
    var students = res;
    for (var student of students) {
      var msg = `Dear ${student.name},
you have a due of ${
        student.due
      } BDT. You are cordially requested to clear fees before class.
-${db.getName(req.params.cid)}`;
      smsController
        .sendOneSms(student.phone_no.toString(), msg)
        .catch((err) => console.log(err));
    }
    var sms = {
      to: 'Dues',
      msg: 'Notified All Student who have due',
      status: 'delivered',
      count: Number(res.length),
      ref: 'Due',
    };
    const smsd = new db.getdb(req.params.cid).smsData(sms);
    return smsd.save();
    //return {status:1}
  } catch (err) {
    console.log(err);
  }
};

exports.getPaybyRoll = async (req, reply) => {
  try {
    var roll = req.params.roll;
    var pass = req.params.pass;
    const iss = await db
      .getdb(req.params.cid, false)
      .studentData.findOne({ roll: roll, password: pass });
    if (!iss || iss == null) {
      return { mag: 'UnAuthorized!' };
    }
    var res = await db
      .getdb(req.params.cid, false)
      .payData.find({ studentid: roll });
    return res;
  } catch (err) {
    console.log(err);
  }
};

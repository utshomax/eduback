const db = require('../dbcontroller/dbutil');
const smsController = require('../controllers/smsController');
exports.addNoti = async function (req, rep) {
  try {
    const result = new db.getdb(req.params.cid).notiData(req.body);
    return result.save();
  } catch (err) {
    console.log(err);
  }
};
exports.stuRequest = async function (req, rep) {
  try {
    const result = new db.getdb(req.params.cid, false).notiData(req.body);
    try {
      let data = {
        data: req.body,
        code: req.params.cid,
      };
      let msg = JSON.stringify(data);
      this.websocketServer.clients.forEach((client) => {
        client.readyState === 1 && client.send(msg);
      });
    } catch (err) {
      console.log(err);
    }
    return result.save();
  } catch (err) {
    rep.code(400).send('error');
    console.log(err);
  }
};
exports.getPending = async function (req, rep) {
  try {
    const result = await db
      .getdb(req.params.cid, false)
      .notiData.find({ status: 'pending', senderid: Number(req.params.roll) });
    return result;
  } catch (err) {
    rep.code(400).send('error');
    console.log(err);
  }
};
exports.getNotice = async function (req, rep) {
  try {
    const result = await db
      .getdb(req.params.cid, false)
      .notiData.find({ isAdmin: true, batchid: Number(req.params.batchid) });
    return result;
  } catch (err) {
    rep.code(400).send('error');
    console.log(err);
  }
};
exports.getAllRequest = async function (req, rep) {
  try {
    const result = await db.getdb(req.params.cid).notiData.find();
    return result;
  } catch (err) {
    console.log(err);
  }
};
exports.makeDis = async function (req, rep) {
  try {
    const res = await db
      .getdb(req.params.cid)
      .notiData.findOneAndUpdate(
        { id: req.params.id },
        { status: req.params.state },
        { upsert: true, new: true }
      );
    if (req.params.state == 'aproved') {
      try {
        var data = res;
        let paydata = {};
        var tpaid = Number(data.paymentinfo.paid);
        const payment = await db
          .getdb(req.params.cid)
          .studentData.findOneAndUpdate(
            { roll: data.senderid.toString() },
            { $inc: { due: -tpaid } },
            { new: true }
          );
        if (Number(payment.due) < Number(data.paymentinfo.due)) {
          paydata['due'] = Number(payment.due);
        } else {
          rep.code(500).send('error');
        }
        paydata['studentid'] = Number(payment.roll);
        paydata['name'] = payment.name;
        paydata['paid'] = data.paymentinfo.paid;
        paydata['ref'] = req.params.ref;
        paydata['month'] = data.paymentinfo.month;
        paydata['discount'] = 0;
        paydata['batchname'] = payment.batchname;
        paydata['date'] = data.paymentinfo.datetime;
        const payinfo = new db.getdb(req.params.cid).payData(paydata);
        let pdta = await payinfo.save();
        var msg = `Dear ${payment.name},
                  ${data.paymentinfo.paid} Taka has been received. Month : ${
          data.paymentinfo.month
        }. Due: ${payment.due}. 
                  Thanks,
                  -${db.getName(req.params.cid)}.`;
        var to = payment.phone_no.toString();
        smsController.smsAction(to, msg);
        return { paydata: pdta, notidata: res };
      } catch (err) {
        const resp = await db
          .getdb(req.params.cid)
          .notiData.findOneAndUpdate(
            { id: req.params.id },
            { status: 'pending' },
            { upsert: true, new: true }
          );
        console.log(err);
        return resp;
      }
    } else {
      return res;
    }
  } catch (err) {
    console.log(err);
  }
};

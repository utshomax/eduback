const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const { URLSearchParams } = require('url');
const db = require('../dbcontroller/dbutil');
exports.getsms = async (req, rep) => {
  try {
    const result = await db.getdb(req.params.cid).smsData.find();
    return result;
  } catch (err) {
    console.log(err);
  }
};

exports.sendsms = async (req, reply) => {
  try {
    const smsreq = req.body;
    const report = await this.smsAction(smsreq.to, smsreq.msg);
    if (report.status == 1101) {
      try {
        var sms = {
          to: smsreq.to,
          msg: smsreq.msg,
          status: 'delivered',
          count: report.count,
          ref: smsreq.ref,
        };
        const res = new db.getdb(req.params.cid).smsData(sms);
        await res.save();
        return report;
      } catch (err) {
        console.log(err);
        return { status: 2 };
      }
    } else {
      return { status: 0 };
    }
  } catch (err) {
    console.log(err);
  }
};

exports.smsAction = async (to, message) => {
  console.log(to, message);
  return new Promise(async function (resolve, reject) {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    var urlencoded = new URLSearchParams();
    urlencoded.append('username', 'madvert');
    urlencoded.append('password', 'Mad@vert__2020');
    urlencoded.append('number', to);
    urlencoded.append('message', message);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: urlencoded,
    };

    const res = await fetch('http://66.45.237.70/api.php', requestOptions);
    if (res.ok) {
      var r = await res.text();
      var rp = r.split('|');
      console.log(rp);
      if (rp.length > 1) {
        resolve({ status: Number(rp[0]), count: Number(rp[2]) });
      } else {
        resolve({ status: Number(rp[0]), count: 0 });
      }
    } else {
      reject({ msg: 'something went Wrong!' });
    }
  });
};
exports.sendOneSms = async (to, msg) => {
  console.log(to, msg);
  return new Promise(async function (resolve, reject) {
    var encodedmsg = encodeURI(msg);
    const res = await fetch(
      `http://66.45.237.70/api.php?username=madvert&password=Mad@vert__2020&number=${to}&message=${encodedmsg}`
    );
    if (res.ok) {
      var r = await res.text();
      var rp = r.split('|');
      console.log(rp);
      if (rp.length > 1) {
        resolve({ status: Number(rp[0]), count: Number(rp[2]) });
      } else {
        resolve({ status: Number(rp[0]), count: 0 });
      }
    } else {
      reject({ msg: 'something went Wrong!' });
    }
  });
};

exports.smsTobatch = async (req, reply) => {
  try {
    const smsreq = req.body;
    var batchid = smsreq.to;
    var batchname = smsreq.batchname;
    var msg = smsreq.msg;
    var res = await db
      .getdb(req.params.cid)
      .studentData.find({ batchid: Number(batchid) });
    var students = res;
    var msgto = '';
    for (var student of students) {
      msgto += student.phone_no.toString() + ',';
    }
    this.smsAction(msgto, msg).catch((err) => console.log(err));
    var sms = {
      to: batchname,
      msg: smsreq.msg,
      status: 'delivered',
      count: Number(res.length),
      ref: smsreq.ref,
    };
    const smsd = new db.getdb(req.params.cid).smsData(sms);
    return smsd.save();
    // return {status:1}
  } catch (err) {
    console.log(err);
    return { status: 0 };
  }
};

exports.smsTostudent = async (req, reply) => {
  try {
    const smsreq = req.body;
    var rolls = smsreq.to.split(',');
    var msg = smsreq.msg;
    var faild = 0;
    //console.log(smsreq)
    for (var roll of rolls) {
      var res = await db
        .getdb(req.params.cid)
        .studentData.findOne({ roll: roll.toString() });
      if (!res || res == null) {
        faild++;
      } else {
        this.sendOneSms(res.phone_no.toString(), msg).catch((err) =>
          console.log(err)
        );
      }
    }
    var sms = {
      to: smsreq.to,
      msg: smsreq.msg,
      status: 'delivered',
      count: rolls.length,
      ref: smsreq.ref,
    };
    const smsd = new db.getdb(req.params.cid).smsData(sms);
    return smsd.save();
    //return {status:1,faild:faild}
  } catch (err) {
    console.log(err);
    return { status: 0 };
  }
};

exports.smsToall = async (req, reply) => {
  try {
    const smsreq = req.body;
    var msg = smsreq.msg;
    //console.log(smsreq)
    var res = await db.getdb(req.params.cid).studentData.find();
    var students = res;
    var to = '';
    for (var student of students) {
      to += student.phone_no.toString() + ',';
    }
    this.smsAction(to, msg).catch((err) => console.log(err));
    var sms = {
      to: smsreq.to,
      msg: smsreq.msg,
      status: 'delivered',
      count: Number(res.length),
      ref: smsreq.ref,
    };
    const smsd = new db.getdb(req.params.cid).smsData(sms);
    return smsd.save();
    // return {status:1}
  } catch (err) {
    console.log(err);
    return { status: 0 };
  }
};

exports.smsRes = async (req, reply) => {
  try {
    const smsreq = req.body;
    var batchid = smsreq.batchid;
    var examname = smsreq.examname;
    var fullmark = smsreq.fullmark;
    var examid = smsreq.examid;
    var brand = db.getName(req.params.cid);
    // var sortStr = `-result.find(o => o.examid == ${examid}).mark`
    var allRes = await db
      .getdb(req.params.cid)
      .studentRes.find({ batchid: Number(batchid) });
    let sres = allRes.sort(function (a, b) {
      try {
        return (
          b.result.find((o) => o.examid == examid).mark -
          a.result.find((o) => o.examid == examid).mark
        );
      } catch (e) {
        return +1;
      }
    });
    var highMark = sres[0].result.find((o) => o.examid == examid).mark;
    var students = sres;
    for (let i = 0; i < students.length; i++) {
      try {
        var stu = students[i];
        var to = stu.phone_no.toString();
        var mark = stu.result.find((o) => o.examid == examid).mark;
        var msg = `Exam Topic:${examname}, Name:${
          stu.name
        }, Marks Obtained:${mark}, Full Marks:${fullmark}, Highest Mark: ${highMark}, Position : ${
          Number(i) + 1
        }
-${brand}`;
        this.sendOneSms(to, msg);
      } catch (e) {
        console.log(stu.roll, stu.result);
      }
    }
    var sms = {
      to: examname,
      msg: 'Result to students',
      status: 'delivered',
      count: Number(allRes.length),
      ref: 'Exam Result',
    };
    //console.log(sms)
    const smsd = new db.getdb(req.params.cid).smsData(sms);
    // await smsd.save();
    return smsd.save();
  } catch (err) {
    console.log(err);
    return { status: 0 };
  }
};

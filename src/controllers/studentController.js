const db = require('../dbcontroller/dbutil');
const sms = require('../controllers/smsController');
exports.isStudent = async (req, reply) => {
  try {
    if (
      typeof req.body.roll == 'undefined' ||
      typeof req.body.password == 'undefined'
    ) {
      return { status: 4, msg: 'request error' };
    }

    var roll = req.body.roll;
    var password = req.body.password;
    var data;
    if (roll.length > 0 && password.length > 0) {
      data = {
        roll: roll,
        password: password,
      };
    } else {
      return { msg: 'length error' };
    }
    console.log(data);
    const result = await db
      .getdb(req.params.cid)
      .studentData.findOne(data, function (err, student) {
        if (err) {
          return { msg: 'db error' };
        }
        return student;
      });
    console.log(result);
    if (result) {
      return result;
    }
    return { status: 0, msg: 'no user found' };
  } catch (err) {
    console.log(err);
  }
};

exports.addStudent = async (req, reply) => {
  try {
    var brand = db.getName(req.params.cid);
    try {
      const student = new db.getdb(req.params.cid).studentData(req.body);
      let res = await student.save();
      let { _id, __v, ...resbody } = res._doc;
      console.log(resbody);
      const resp = new db.getdb(req.params.cid).studentRes(resbody);
      resp.save();
      let msg = `Dear ${student.name},
Your admission to ${student.batchname} is successful ! Roll : ${student.roll}, 
PIN : ${student.password} , visit https://stu.edubase.xyz
Thanks,
-${brand}`;
      sms
        .smsAction(student.phone_no, msg)
        .then(console.log('Sent!'))
        .catch((err) => console.log(err));
      return res;
    } catch (err) {
      console.log(err);
      return { status: 0, msg: 'Error' };
    }
  } catch (err) {
    console.log(err);
  }
};
exports.allStudent = async (req, reply) => {
  try {
    // const students = await studentData.find()
    const students = await db.getdb(req.params.cid).studentData.find();

    return students;
  } catch (err) {
    console.log(err);
  }
};

exports.getStuinfors = async (req, reply) => {
  try {
    const student = await db
      .getdb(req.params.cid)
      .studentData.findOne(
        { roll: req.body.roll, password: req.body.password },
        function (err, student) {
          return student;
        }
      );
    return student;
  } catch (err) {
    console.log(err);
  }
};
exports.getStuinfoAr = async (req, reply) => {
  try {
    const student = await db
      .getdb(req.params.cid)
      .studentData.findOne({ roll: req.params.roll }, function (err, student) {
        return student;
      });
    return student;
  } catch (err) {
    console.log(err);
  }
};

exports.updateStudent = async (req, reply) => {
  try {
    const { ...updateData } = req.body;

    //Deleting Due and DOB ..Bug fix of updateing batch
    delete updateData.due;
    if (updateData.dob == '') {
      delete updateData.dob;
    }
    console.log(updateData);
    const update = await db
      .getdb(req.params.cid)
      .studentData.findOneAndUpdate({ roll: req.body.roll }, updateData, {
        new: true,
      });
    const res = await db
      .getdb(req.params.cid)
      .studentRes.findOneAndUpdate({ roll: req.body.roll }, updateData);
    return update;
  } catch (err) {
    console.log(err);
  }
};
exports.deleteStudent = async (req, reply) => {
  try {
    const roll = req.params.roll;
    var res = await db
      .getdb(req.params.cid)
      .studentData.deleteOne({ roll: roll });
    var result = await db
      .getdb(req.params.cid)
      .studentRes.deleteOne({ roll: roll });
    return res;
  } catch (err) {
    console.log(err);
  }
};

exports.fillterStudent = async (req, reply) => {
  try {
    const batchid = req.params.batch;
    var res = await db
      .getdb(req.params.cid)
      .studentRes.find({ batchid: Number(batchid) });
    return res;
  } catch (err) {
    console.log(err);
  }
};

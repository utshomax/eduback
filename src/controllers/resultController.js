const db = require('../dbcontroller/dbutil');
exports.getResult = async (req, reply) => {
  try {
    if (typeof req.body.roll == 'undefined') {
      return { status: 4, msg: 'request error' };
    }
    var roll = req.body.roll;
    var pass = req.body.password;
    const result = await db
      .getdb(req.params.cid)
      .studentRes.findOne(
        { roll: roll, password: pass },
        function (err, result) {
          if (err) {
            return { msg: 'db error' };
          }
          return result;
        }
      );
    if (result) {
      return result;
    }
    return { status: 0, msg: 'Result Not Found!' };
  } catch (err) {
    console.log(err);
  }
};

exports.allResult = async (req, reply) => {
  try {
    const result = await db.getdb(req.params.cid).studentRes.find();
    return result;
  } catch (err) {
    console.log(err);
  }
};

exports.updateResult = async (req, reply) => {
  try {
    const { ...updateData } = req.body;
    const update = await db
      .getdb(req.params.cid)
      .studentRes.findOneAndUpdate({ roll: req.body.roll }, updateData, {
        new: true,
      });
    return update;
  } catch (err) {
    console.log(err);
  }
};
exports.addResultByExam = async (req, reply) => {
  try {
    const reqdata = req.body;
    const info = reqdata.info;
    const exam = info.examid;
    const data = reqdata.data;
    data.forEach(async (el) => {
      var update = {
        examid: exam,
        mark: Number(el.mark), //Should be number
      };
      const response = await db
        .getdb(req.params.cid)
        .studentRes.findOneAndUpdate(
          { roll: el.roll },
          { $push: { result: update } },
          { new: true, upsert: true }
        );
      console.log(response);
    });
    return { status: 1 };
  } catch (err) {
    console.log(err);
    return { status: 0 };
  }
};
exports.getFilteredStudent = async (req, reply) => {
  try {
    const students = await db
      .getdb(req.params.cid)
      .studentRes.find(
        { group: req.params.group, year: req.params.year },
        function (err, studentData) {
          return studentData;
        }
      );
    return students;
  } catch (err) {
    console.log(err);
  }
};
exports.getResByRoll = async (req, reply) => {
  try {
    const result = await db
      .getdb(req.params.cid)
      .studentRes.findOne({ roll: req.params.roll }, function (err, result) {
        return result;
      });
    const batch = await db
      .getdb(req.params.cid)
      .batchData.findOne({ id: result.batchid }, function (err, batch) {
        return batch;
      });
    var positions = {};
    if (batch.exams.length > 0) {
      for (var exam of result.result) {
        var examid = exam.examid;
        var allRes = await db
          .getdb(req.params.cid, false)
          .studentRes.find({ batchid: Number(result.batchid) });
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
        var index = sres.findIndex((x) => x.roll == result.roll);
        positions[examid] = Number(index) + 1;
      }
    }
    return {
      student: result,
      exams: batch.exams,
      positions: positions,
      startdate: batch.startdate,
    };
  } catch (err) {
    console.log(err);
  }
};
exports.upRes = async (req, reply) => {
  try {
    const reqdata = req.body;
    const roll = req.params.roll;
    const result = await db
      .getdb(req.params.cid)
      .studentRes.findOneAndUpdate(
        { roll: roll, 'result.examid': reqdata.examid },
        { $set: { 'result.$.mark': reqdata.mark } },
        { new: true }
      );
    return result;
  } catch (err) {
    console.log(err);
  }
};
exports.getResbr = async (req, reply) => {
  try {
    const result = await db
      .getdb(req.params.cid, false)
      .studentRes.findOne(
        { roll: req.params.roll, password: req.params.pass },
        function (err, result) {
          return result;
        }
      );
    if (!result || result == null) {
      return { msg: 'UnAuthorized!' };
    }
    const batch = await db
      .getdb(req.params.cid, false)
      .batchData.findOne({ id: result.batchid }, function (err, batch) {
        return batch;
      });
    var positions = {};
    if (batch.exams.length > 0) {
      for (var exam of result.result) {
        var examid = exam.examid;
        var allRes = await db
          .getdb(req.params.cid, false)
          .studentRes.find({ batchid: Number(result.batchid) });
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
        var index = sres.findIndex((x) => x.roll == result.roll);
        positions[examid] = Number(index) + 1;
      }
    }
    var year = batch.startdate.toString().split('/')[2];
    var shiftedYear =
      year.length <= 2 ? (Number(year) + 2000).toString() : year;
    var date = batch.startdate.toString().split('/');
    var ndate = date[0] + '/' + date[1] + '/' + shiftedYear;
    return {
      student: result,
      exams: batch.exams,
      positions: positions,
      startdate: ndate,
    };
  } catch (err) {
    console.log(err);
  }
};

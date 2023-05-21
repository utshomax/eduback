const batch = require('./batch');
const payment = require('./payment');
const student = require('./studentData');
const result = require('./studentRes');
const sms = require('./sms');
const counter = require('./counter');
const noti = require('./notification');
const admin = require('./admin');
const notice = require('./notics');
const general = require('./general');

module.exports.addModels = function (db) {
  db.model('identitycounter', counter);

  //AutoInc Init
  initAutoInc(db, 'studentData', 1000, 'roll');
  initAutoInc(db, 'batchData', 1000, 'id');
  initAutoInc(db, 'payData', 5000, 'id');
  initAutoInc(db, 'smsData', 8000, 'id');
  initAutoInc(db, 'notiData', 10000, 'id');
  initAutoInc(db, 'noticeData', 20000, 'id');

  //AutoInc Models
  student.pre('save', function (next) {
    autoinc(this, 'studentData', next, db, true);
  });
  batch.pre('save', function (next) {
    autoinc(this, 'batchData', next, db);
  });
  payment.pre('save', function (next) {
    autoinc(this, 'payData', next, db);
  });
  sms.pre('save', function (next) {
    autoinc(this, 'smsData', next, db);
  });
  noti.pre('save', function (next) {
    autoinc(this, 'notiData', next, db);
  });
  notice.pre('save', function (next) {
    autoinc(this, 'noticeData', next, db);
  });

  //Model's Init

  db.model('general', general);
  db.model('batchData', batch);
  db.model('adminData', admin);
  db.model('notiData', noti);
  db.model('noticeData', notice);
  db.model('payData', payment);
  db.model('studentRes', result);
  db.model('studentData', student);
  db.model('smsData', sms);

  return db;
};

//AutoInc Function

function autoinc(doc, model, next, db, isString = false) {
  db.models.identitycounter
    .findOneAndUpdate(
      { model: model },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    )
    .then(async function (count) {
      console.log('...count: ' + JSON.stringify(count));
      if (!isString) {
        doc[count.field] = count.count;
      } else {
        let settings = await db.models.general.find().exec();
        let code = settings[0].code.toString();

        doc[count.field] = code + count.count.toString();
      }
      next();
    })
    .catch(function (error) {
      console.error('counter error-> : ' + error);
      throw error;
    });
}

//AutoInc Init Function
async function initAutoInc(db, model, count, field) {
  let exits = await db.models.identitycounter.findOne({ model: model });
  if (exits == null) {
    let res = await new db.models.identitycounter({
      model: model,
      count: count,
      field: field,
    }).save();
    console.log(res);
  }
}

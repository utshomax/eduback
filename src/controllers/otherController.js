const db = require('../dbcontroller/dbutil')
exports.getNotice = async(req,reply) =>{
  try {
      if(typeof req.params.id=='undefined'){  
          return {'status':4,'msg':'request error'}
      }
      var id = req.params.id;
      const result= await db.getdb(req.params.cid).noticeData.findOne({id:id}, function(err, result) {

          if (err) {
              return {'msg':'db error'}
          }
          return result
      });
      if(result){
          return result
      }
      return {'status':0,'msg':'Result Not Found!'}
  }
  catch (err) {
    console.log(err)
  }

}

exports.addnotice = async(req, reply) =>{
  try{
      const res = new db.getdb(req.params.cid).noticeData(req.body)
      return res.save();
      //return {'status':1,'msg':'Result Uploaded Successfully'}
  }
  catch(err){
      console.log(err)
  }
}

exports.getAllNotices = async (req, reply) => {
  try {
    const result = await db.getdb(req.params.cid).noticeData.find()
    return result
  } catch (err) {
   console.log(err);
  }
}

exports.updateNotice = async (req, reply) => {
  try {
    const { ...updateData } = req.body
    const update = await db.getdb(req.params.cid).noticeData.findOneAndUpdate({id:req.body.id}, updateData, { new: true })
    return update
  
  } catch (err) {
    console.log(err)
  }
}

exports.deleteNotice = async (req,reply) =>{
    try {
        const i_id = req.params.id
        var res= await db.getdb(req.params.cid).noticeData.deleteOne({id:Number(i_id)})
        console.log(i_id,res)
        return res
      } catch (err) {
        console.log(err)
      }
}
//Admincontroll

exports.isAdmin = async(req,reply) =>{
  try {
      if(typeof req.body.t_id=='undefined' || typeof req.body.password=='undefined'){  
          return {'status':4,'msg':'request error'}
      }
     
      var t_id = req.body.t_id;
      var password = req.body.password;
      var data;
      if (t_id.length > 0 && password.length > 0) {
          data = {
              t_id: t_id,
              password: password
          }
      } else {
          return {'msg':'length error'}
      }
      console.log(data) 
      const result= await db.getdb(req.params.cid).adminData.findOne(data, function(err, adminData) {

          if (err) {
              return {'msg':'db error'}
          }
          return adminData
      });
      console.log(result)
      if(result){
         return result
      }
      return {'status':0,'msg':'no user found'}
  }
  catch (err) {
    console.log(err)
  }

}
exports.addAdmin = async(req, reply) =>{
  try{
      const res = new db.getdb(req.params.cid).adminData(req.body)
      return res.save();
      //return {'status':1,'msg':'Result Uploaded Successfully'}
  }
  catch(err){
      console.log(err)
  }
}

//notifications
exports.getNotification = async (req, reply) => {
    const res= await db.getdb(req.params.cid).notiData.findOne({receiver:req.params.receiver}).exec();
    return res;
}


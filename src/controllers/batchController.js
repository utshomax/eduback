
const db = require('../dbcontroller/dbutil')
exports.getBatch = async (req,rep) =>{
  try {
    const result = await db.getdb(req.params.cid).batchData.find()
    return result
  } catch (err) {
   console.log(err);
  }
}

exports.addBatch = async(req, reply) =>{
    try{
      console.log(req.body)
        const res =await new db.getdb(req.params.cid).batchData(req.body).save()
        return res
        return {'status':1,'msg':'Result Uploaded Successfully'}
    }
    catch(err){
        console.log(err)
    }
}
exports.addMonth = async(req, reply) =>{
  try{
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = dd+'/'+mm+'/'+yyyy;
    const up = await db.getdb(req.params.cid).batchData.findOneAndUpdate({id:Number(req.params.id)},{currentdate:today})
    if(up){
      var fee = Number(up.fee);
      const stu = await db.getdb(req.params.cid).studentData.updateMany({batchid:Number(req.params.id)},{$inc:{due:+fee}});
      //console.log(stu)
      return {status:1}
    }
    else{
      return {status:0}
    }
  }
  catch(err){
      
      console.log(err)
      return {status:1}
  }
}
exports.deleteBatch = async (req,reply) =>{
    try {
        const i_id = req.params.id
        var res= await db.getdb(req.params.cid).batchData.deleteOne({id:Number(i_id)})
        return res
      } catch (err) {
        console.log(err)
      }
}
exports.addExam= async(req, reply) =>{
  try{
      var exam = req.body.exam
      let batch= await db.getdb(req.params.cid).batchData.findOne({id:req.body.batchid})
      let p_examid = batch ? (batch.exams.length ? batch.exams.pop().examid : 1000) : null
      if(p_examid){
        exam['examid'] = Number(p_examid) + 1
        const res = await db.getdb(req.params.cid).batchData.findOneAndUpdate({id:req.body.batchid},{ $push: { exams: exam } },{new:true});
        return res.exams;
      }
      else{
        reply.code(500).send({status:1,msg:"batch not exist!"})
      }
  }
  catch(err){
      console.log(err)
  }
}
exports.examlist= async(req, reply) =>{
  try{
      var batch = req.params.batch
      const res = await db.getdb(req.params.cid).batchData.findOne({id:batch});
      return res;
  }
  catch(err){
      console.log(err)
  }
}
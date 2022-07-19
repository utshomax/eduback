const studentController = require('../controllers/studentController')
const resultController = require('../controllers/resultController')
const otherController = require('../controllers/otherController')
const batchController = require('../controllers/batchController')
const payController = require('../controllers/paymentController')
const smsController = require('../controllers/smsController')
const notiController = require('../controllers/notificationController')
const wsController = require('../controllers/wsController')


const route={ 
    user:[
            {
                method:'GET',
                url:'/:cid/api/getAllNotice',
                handler:otherController.getAllNotices
            },
            {
                method:'GET',
                url:'/:cid/api/getNotice/:id',
                handler:otherController.getNotice
            },
            {
                method: 'POST',
                url:'/:cid/api/isStudentrf',
                handler : studentController.isStudent
            },
            {
                method:'GET',
                url:'/:cid/api/getPhbyRoll/:roll/:pass',
                handler:payController.getPaybyRoll
            },
            {
                method:'GET',
                url:'/:cid/api/getResbr/:roll/:pass',
                handler:resultController.getResbr
            },
            {
                method:'POST',
                url:'/:cid/api/request',
                handler:notiController.stuRequest
            },
            {
                method:'GET',
                url:'/:cid/api/getPending/:roll',
                handler:notiController.getPending
            },
            {
                method:'GET',
                url:'/:cid/api/getNotice/:roll/:batchid',
                handler:notiController.getNotice
            },
        ],
        

    //END OF USER ROUTES

    //ADMIN ROUTES
     admin: [
        //Batch 
        {
            method:'GET',
            url:'/:cid/api/addMonth/:id',
            handler:batchController.addMonth
        },
        {
            method:'POST',
            url:'/:cid/api/batch',
            handler:batchController.addBatch
        },
        {
            method:'GET',
            url:'/:cid/api/batch',
            handler:batchController.getBatch
        },
        {
            method:'DELETE',
            url:'/:cid/api/batch/:id',
            handler:batchController.deleteBatch
        },
        //resultfont
        {
            method: 'POST',
            url:'/:cid/api/getResultrf',
            handler : resultController.getResult
        },
        {
            method: 'POST',
            url:'/:cid/api/getStuinforf',
            handler : studentController.getStuinfors
        }, 
        //student
        {
            method: 'POST',
            url:'/:cid/api/isStudent',
            handler : studentController.isStudent
        },
        {
            method: 'POST',
            url:'/:cid/api/addStudent',
            handler : studentController.addStudent
        },

        {
            method: 'GET',
            url:'/:cid/api/getOneStudent/:roll',
            handler : studentController.getStuinfoAr
        },
        {
            method: 'GET',
            url:'/:cid/api/getAllStudent',
            handler : studentController.allStudent
        },
        {
            method: 'PUT',
            url:'/:cid/api/updateStudent',
            handler : studentController.updateStudent
        },
        {
            method: 'DELETE',
            url:'/:cid/api/deleteStudent/:roll',
            handler : studentController.deleteStudent
        },

        //result
        {
            method: 'POST',
            url:'/:cid/api/getResult',
            handler : resultController.getResult
        },
        {
            method: 'PUT',
            url:'/:cid/api/upResult/:roll',
            handler : resultController.upRes
        },
        {
            method: 'PUT',
            url:'/:cid/api/addResult',
            handler : resultController.addResultByExam
        },
        {
            method: 'GET',
            url:'/:cid/api/getAllResult',
            handler : resultController.allResult
        },
        {
            method: 'PUT',
            url:'/:cid/api/updateResult',
            handler : resultController.updateResult
        },
        {
            method: 'GET',
            url:'/:cid/api/getFilteredStudent/:year/:group',
            handler : resultController.getFilteredStudent
        },
        {
            method: 'GET',
            url:'/:cid/api/getResByRoll/:roll',
            handler : resultController.getResByRoll
        },
        {
            method: 'POST',
            url:'/:cid/api/smsRes',
            handler : smsController.smsRes
        },

        //Notice

        {
            method:'POST',
            url:'/:cid/api/addNotice',
            handler:otherController.addnotice
        },
        {
            method:'PUT',
            url:'/:cid/api/updateNotice',
            handler:otherController.updateNotice
        },
        {
            method:'DELETE',
            url:'/:cid/api/deleteNotice/:id',
            handler:otherController.deleteNotice
        },

        //Admin
        {
            method:'POST',
            url:'/:cid/api/isAdmin',
            handler:otherController.isAdmin
        },
        {
            method:'POST',
            url:'/:cid/api/addAdmin',
            handler:otherController.addAdmin
        },

        //payment
        {
            method:'GET',
            url:'/:cid/api/getDues',
            handler:payController.getDues
        },
        {
            method:'POST',
            url:'/:cid/api/pay',
            handler:payController.pay
        },
        {
            method:'GET',
            url:'/:cid/api/getHistory',
            handler:payController.getPayhistory
        },
        //Sms
        {
            method:'GET',
            url:'/:cid/api/getSms',
            handler:smsController.getsms
        },
        {
            method:'POST',
            url:'/:cid/api/sendSms',
            handler:smsController.sendsms
        },
        {
            method:'GET',
            url:'/:cid/api/notifyAll',
            handler:payController.notifyall
        },
        {
            method:'POST',
            url:'/:cid/api/smsTobatch',
            handler:smsController.smsTobatch
        },
        {
            method:'POST',
            url:'/:cid/api/smsTostudent',
            handler:smsController.smsTostudent
        },
        {
            method:'POST',
            url:'/:cid/api/smsToall',
            handler:smsController.smsToall
        },
        //Exams
        {
            method:'POST',
            url:'/:cid/api/addExam',
            handler:batchController.addExam
        },
        {
            method:'GET',
            url:'/:cid/api/exam/:batch',
            handler:batchController.examlist
        },
        //FillteredStudent
        {
            method:'GET',
            url:'/:cid/api/fillteredStudent/:batch',
            handler:studentController.fillterStudent
        },
        //Notification
        {
            method:'POST',
            url:'/:cid/api/noti',
            handler:notiController.addNoti
        },
        {
            method:'GET',
            url:'/:cid/api/noti',
            handler:notiController.getAllRequest
        },
        {
            method:'GET',
            url:'/:cid/api/noti/makedis/:id/:state/:ref',
            handler:notiController.makeDis
        },
        //Realtime Routes --ws controllers
    ],
    realtime:[
        {
            method:'GET',
            url:'/:cid/api/ws',
            handler: function(req, reply){
                reply.send({ msg: 'In Realtime Mode!' })
            },
            wsHandler: wsController.controller
            //function(req,reply){
            //   console.log(this.websocketServer)
            //}// 
        }
    ]
}

module.exports = route
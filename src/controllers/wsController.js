const db = require('../dbcontroller/dbutil')

exports.controller= function(conn,req){
    let token = req.query.token
    try{
      this.jwt.verify(token,this.jwt.secret)
    }
    catch(err){
      console.log('soket error')
      return
    }
    conn.setEncoding('utf8')
    conn.socket.on('message', message => {
      console.log('ws msg received !')
    })
}
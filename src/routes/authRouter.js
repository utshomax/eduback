const db = require('../dbcontroller/dbutil');
const bcrypt = require('bcryptjs');
async function AuthRouter(fastify) {
  //ADMIN AUTH
  fastify.post('/:cid/api/auth/login', async (req, reply) => {
    try {
      if (
        !req.body ||
        typeof req.body.t_id == 'undefined' ||
        typeof req.body.password == 'undefined'
      ) {
        reply.send({ status: 4, msg: 'request error' });
        return;
      }
      var t_id = req.body.t_id;
      var password = req.body.password;
      var data;
      if (t_id.length > 0 && password.length > 0) {
        data = {
          t_id: t_id,
        };
      } else {
        reply.send({ msg: 'length error' });
        return;
      }
      let adb = db.getdb(req.params.cid);
      if (!adb) {
        reply.send({ status: 0, msg: 'no user found' });
        return;
      }
      let settings = await adb.general.findOne({});

      const user = await adb.adminData.findOne(data, function (err, doc) {
        if (err) {
          reply.send({ status: 0, msg: 'DB Error !' });
          return null;
        }
        return doc;
      });
      if (user) {
        try {
          //Need to update database password for auth...
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = await reply.jwtSign(
              {
                name: user.name,
                role: user.power,
                t_id: user.t_id,
              },
              { expiresIn: '1h' }
            );
            return reply.send({ token: token, user: user, settings: settings });
          } else {
            return reply.send({ status: 0, msg: 'User Does Not Exist !' });
          }
        } catch (e) {
          reply.send({ status: 0, msg: 'handler error !' });
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
  //USER AUTH
  fastify.post('/api/auth/user', async (req, reply) => {
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
          password: password, //Will romove it later
        };
      } else {
        return { msg: 'length error' };
      }
      console.log(data);
      let cid = roll.toString().substring(0, 2);
      let idb = db.getdb(cid, false);
      if (idb) {
        try {
          const result = await idb.studentData.findOne(
            data,
            function (err, student) {
              if (err) {
                return { msg: 'db error' };
              }
              return student;
            }
          );
          if (result) {
            const token = await reply.jwtSign(
              {
                name: result.name,
                roll: result.roll,
                password: password,
              },
              { expiresIn: '1h' }
            );
            reply.send({ token: token, user: result });
            return;
          }
        } catch (err) {
          //console.log(err)
          reply.send({ status: 0, msg: 'no user found' });
        }
      }

      reply.send({ status: 0, msg: 'no user found' });
    } catch (err) {
      console.log(err);
    }
  });
}
module.exports = AuthRouter;

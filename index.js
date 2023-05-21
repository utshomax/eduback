//env for dev
require('dotenv').config();
const app = require('fastify')({
  logger: true,
});
const routes = require('./src/routes');
const PORT = process.env.PORT || 5000;
const { connectAllDb } = require('./src/dbcontroller/dbutil');
let origns = process.env.ORIGINS
  ? process.env.ORIGINS.split(',')
  : [
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'http://localhost:3000',
      'http://192.168.0.101:3000',
      'http://localhost:56975'
    ];
const jwt = require('fastify-jwt');
app.register(require('fastify-cors'), {
  origin: true,
  credentials: 'include',
});
app.register(require('./src/routes/authRouter'));
app.register(require('./src/routes/admin'));
app.register(require('fastify-websocket'), {
  options: { clientTracking: true },
});
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'Mad@vert__2020',
});
//DB connections
connectAllDb();

//ADMIN VALIDATION FOR CLIENTS

app
  .decorate('jwtVerifyAdmin', async (request, reply) => {
    try {
      let user = await request.jwtVerify();
      if (user.role != 'admin') {
        reply.code(403).send('Unauthorized!');
      }
      return user;
    } catch (err) {
      reply.send(err);
    }
  })
  .after(() => {
    routes.admin.forEach((route) => {
      route['preHandler'] = [app.jwtVerifyAdmin];
      app.route(route);
    });
  });

//USER VALIDATION
app
  .decorate('jwtVerifyUser', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  })
  .after(() => {
    routes.user.forEach((route) => {
      route['preHandler'] = [app.jwtVerifyUser];
      app.route(route);
    });
    routes.realtime.forEach((route) => {
      app.route(route);
    });
  });

//SERVER
const start = async () => {
  try {
    await app.listen(PORT, '0.0.0.0');
    console.log(`server listening on ${app.server.address().port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();

//module.exports = app;

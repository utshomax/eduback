//Protected Routes for MADVERTLABS-Core Functionalities

const db = require('../dbcontroller/dbutil');
const tenantController = require('../controllers/admin/adminController');
const userController = require('../controllers/admin/userController');
const rootController = require('../controllers/tenant');
const adminAuth = require('../middleware/adminAuth');
async function adminRouter(fastify) {
  //Tenant Routes to get all tenants and create new tenant
  fastify.get(
    '/api/tenant',
    { preHandler: [adminAuth] },
    tenantController.fetchAll
  );
  fastify.post(
    '/api/tenant',
    { preHandler: [adminAuth] },
    tenantController.create
  );

  //Creation of Users for a tenant
  fastify.post(
    '/:cid/api/admin',
    { preHandler: [adminAuth] },
    userController.signUp
  );
  fastify.get(
    '/:cid/api/admin',
    { preHandler: [adminAuth] },
    userController.fetchAll
  );
  //Setting General Settings for a tenant
  fastify.get(
    '/:cid/api/settings',
    { preHandler: [adminAuth] },
    rootController.getSettings
  );
  fastify.post(
    '/:cid/api/settings',
    { preHandler: [adminAuth] },
    rootController.setSettings
  );
  //Routes for Support
  fastify.get(
    '/api/support',
    { preHandler: [adminAuth] },
    rootController.getAllSupportMessage
  );
  fastify.post(
    '/api/support',
    { preHandler: [adminAuth] },
    rootController.sendMessage
  );

  //Routes for Notification
  fastify.get('/:cid/api/notice', rootController.getNotice);
  fastify.post(
    '/api/notice',
    { preHandler: [adminAuth] },
    rootController.sendGlobalNotice
  );
  fastify.post('/:cid/api/notice', rootController.sendNotice);

  //Toggle HighLight for Notice
  fastify.get(
    '/api/notice/toggle/:id/:value',
    { preHandler: [adminAuth] },
    rootController.togglehighlight
  );

  //Recharge
  fastify.get(
    '/:cid/api/recharge/:amount',
    { preHandler: [adminAuth] },
    rootController.doRecharge
  );

  //Reconncet to DB with new tenant

  fastify.get(
    '/api/reconnect',
    { preHandler: [adminAuth] },
    rootController.reconnect
  );
}
module.exports = adminRouter;

const { BASE_DB_URI, ADMIN_DB_NAME } = require('../config/env.json');
const { initAdminDbConnection } = require('./initAdmin');
const { initTenantDbConnection } = require('./initTenant');
const tenantService = require('../services/tenant');
const DB_URI =process.env.BASE_DB_URI ? 'mongodb+srv://'+ process.env.USER+':'+process.env.PASS+'@'+process.env.BASE_DB_URI : BASE_DB_URI;
const DB_NAME = process.env.DB_NAME || ADMIN_DB_NAME;
let dbmain;
let adminDbConnection;

const connectAllDb = async () => {
  return new Promise(async function (resolve, reject) {
    let tenants;
    const ADMIN_DB_URI = DB_URI + '/' + DB_NAME + '?authSource=admin';
    adminDbConnection = initAdminDbConnection(ADMIN_DB_URI);
    console.log('connectAllDb adminDbConnection');
    try {
      tenants = await tenantService.getAllTenants(adminDbConnection);
      console.log('connectAllDb tenants', tenants);
    } catch (e) {
      console.log('connectAllDb error', e);
      return reject(e);
    }
    dbmain = tenants
      .map((tenant) => {
        return {
          [`edu-${tenant.cid}`]: {
            con: initTenantDbConnection(tenant.dbURI),
            code: tenant.code,
            cid: tenant.cid,
            name: tenant.name,
          },
        };
      })
      .reduce((prev, next) => {
        return Object.assign({}, prev, next);
      }, {});
    return resolve(dbmain);
  });
};

const getdb = function (parm, isAdmin = true) {
  if (dbmain == null) {
    return null;
  }
  if (isAdmin) {
    console.log(`Getting connection for ${parm}`);
    try {
      return dbmain[`edu-${parm}`].con.models;
    } catch (e) {
      console.log(`error on getting connection - ${parm}`);
      return null;
    }
  } else {
    for (prop in dbmain) {
      if (dbmain[prop].code == parm) {
        return dbmain[prop].con.models;
      }
    }
    return null;
  }
};

const getName = function (cid) {
  return dbmain[`edu-${cid}`].name;
};

const getAllTenantConnection = () => {
  if (dbmain) {
    console.log('Getting All Connections !');
    return dbmain;
  }
};

const getAdminConnection = () => {
  if (adminDbConnection) {
    console.log('Getting adminDbConnection');
    return adminDbConnection;
  }
};

module.exports = {
  connectAllDb,
  getdb,
  getName,
  getAdminConnection,
  getAllTenantConnection,
};

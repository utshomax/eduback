//Creation of tenant

const { BASE_DB_URI } = require('../config/env.json');
const DB_URI =process.env.BASE_DB_URI ? 'mongodb+srv://'+ process.env.USER+':'+process.env.PASS+'@'+process.env.BASE_DB_URI : BASE_DB_URI;

const getAllTenants = async (adminDbConnection) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenants = await Tenant.find({});
    console.log('getAllTenants tenants', tenants);
    return tenants;
  } catch (error) {
    console.log('getAllTenants error', error);
    throw error;
  }
};
const getOneTenant = async (adminDbConnection, cid) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const tenant = await Tenant.findOne({
      cid,
    });
    return tenant;
  } catch (error) {
    console.log('getOneTenant error', error);
    throw error;
  }
};
const createTenant = async (adminDbConnection, body) => {
  try {
    const Tenant = await adminDbConnection.model('Tenant');
    const { name, cid, code } = body;
    const tenantPresent = await Tenant.findOne({
      cid,
      code,
    });
    if (tenantPresent) {
      throw new Error('Tenant Already Present');
    }
    const newTenant = await new Tenant({
      name,
      cid,
      code,
      dbURI: `${DB_URI}/edb-${cid}?authSource=admin`,
    }).save();
    return newTenant;
  } catch (error) {
    console.log('createTenant error', error);
    throw error;
  }
};

module.exports = { getAllTenants, createTenant, getOneTenant };

//Creating a tenant

//Make a api req to create tenant --->
//Reconnect using the new tenant --> api/reconnect
//Creating a user for tenant ---->
//Set general settings for tenant ---->

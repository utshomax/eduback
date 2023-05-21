const { getAdminConnection } = require('../../dbcontroller/dbutil');
const tenantService = require('../../services/tenant');

const create = async (req, res) => {
  try {
    const tenant = await tenantService.createTenant(
      getAdminConnection(),
      req.body
    );
    res.code(200).send({ success: true, tenant });
  } catch (err) {
    console.log('signUp error', err);
    res
      .code(err.statusCode || 500)
      .send({ success: false, error: err.message });
  }
};

const fetchAll = async (req, res) => {
  try {
    const tenants = await tenantService.getAllTenants(getAdminConnection());
    res.send({ success: true, tenants });
  } catch (err) {
    console.log('fetchAll error', err);
    res.code(err.statusCode || 500).send({ error: err.message });
  }
};

module.exports = { create, fetchAll };

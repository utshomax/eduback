const { getdb, getName } = require('../../dbcontroller/dbutil');
const userService = require('../../services/user');

const signUp = async (req, res) => {
  try {
    const dbConnection = getdb(req.params.cid);
    console.log('signUp dbConnection', getName(req.params.cid));
    const user = await userService.createUser(dbConnection, req.body);
    res.code(200).send({ success: true, user });
  } catch (err) {
    console.log('signUp error', err);
    res.code(err.statusCode || 500).send({ error: err.message });
  }
};

const fetchAll = async (req, res) => {
  try {
    const dbConnection = getdb(req.params.cid);
    console.log('fetchAll UserController', getName(req.params.cid));
    const users = await userService.getAllUsers(dbConnection);
    res.code(200).send({ success: true, users });
  } catch (err) {
    console.log('fetchAll error', err);
    res.code(err.statusCode || 500).send({ error: err.message });
  }
};

module.exports = { signUp, fetchAll };

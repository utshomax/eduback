//Implement Admin User Signup Here

const bcrypt = require('bcryptjs');

const getAllUsers = async (tenantDbConnection) => {
  try {
    const User = await tenantDbConnection.adminData;
    const users = await User.find({});
    console.log('getAllUsers users', users);
    return users;
  } catch (error) {
    console.log('getAllUsers error', error);
    throw error;
  }
};
const check = async (tenantDbConnection) => {
  try {
    const User = await tenantDbConnection.adminData;
    const users = await User.find({});
    console.log('getAllUsers users', users);
    return users;
  } catch (error) {
    console.log('getAllUsers error', error);
    throw error;
  }
};

const createUser = async (tenantDbConnection, body) => {
  try {
    const User = await tenantDbConnection.adminData;
    let data = body;
    const { t_id, password } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    data.password = hashedPassword;
    const userPresent = await User.findOne({
      t_id,
    });
    if (userPresent) {
      throw new Error('User Already Present');
    }
    const newUser = await new User({
      ...data,
    }).save();
    return newUser;
  } catch (error) {
    console.log('createUser error', error);
    throw error;
  }
};

module.exports = { getAllUsers, createUser };

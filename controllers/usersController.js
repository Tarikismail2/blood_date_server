const sequelize = require('../database');
const  User  = sequelize.users;


const checkUserExists = async (email) => {
    const user = await User.findOne({ where: { email } });
    return !!user;
};


const insertUser = async (firstName, lastName, email, mobile, encryptedPassword) => {
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        mobile,
        password: encryptedPassword
    });
    return newUser;
};


module.exports = {
    checkUserExists,
    insertUser
};

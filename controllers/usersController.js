const sequelize = require('../database');
const  User  = sequelize.users;

// Function to check if the user already exists
const checkUserExists = async (email) => {
    const user = await User.findOne({ where: { email } });
    return !!user;
};

// Function to insert a new user into the database
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

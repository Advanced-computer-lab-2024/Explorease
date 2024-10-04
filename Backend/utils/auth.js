const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utility function to hash passwords
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Utility function to compare hashed passwords
const comparePassword = async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
};

// Utility function to generate JWT token
const createToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
    hashPassword,
    comparePassword,
    createToken
};

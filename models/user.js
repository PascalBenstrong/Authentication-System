const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Create Schema and model

const UserSchema = new Schema({
    name: String,
    surname: String,
    username: {
        type: String,
        required: true
    },
    description: String,
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //Set password to hashed password
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}

module.exports.getUserByEmail = (email, callback) => {
    User.findOne({
        email: email
    }, callback);
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.comparePassword = (password, hash, callback) => {

    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}
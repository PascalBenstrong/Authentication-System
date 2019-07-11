const LocalStrategy = require('passport-local');
const User = require('../models/user');

module.exports = (passport) => {

    passport.use(new LocalStrategy({
        usernameField: 'username'
    }, (username, password, done) => {

        //Match User

        User.findOne({
            username: username
        }).then(user => {
            if (!user)
                return done(null, false, {
                    message: 'That username is not registered'
                });

            // Match password

            User.comparePassword(password, user.password, (err, isMatch) => {
                if (isMatch)
                    return done(null, user, {
                        message: "You have signed in"
                    });
                else return done(null, false, {
                    message: 'Incorrect Password'
                });
            });
        }).catch(err => console.log(err));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.getUserById(id, (err, user) => {
            done(err, user);
        })
    });
}
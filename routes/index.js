const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');
const User = require('../models/user');
const passport = require('passport');


router.get('/', ensureAuthenticated, (req, res) => {

    res.redirect('/user/signin')
});

// Sign up Page

router.get('/user/signup', (req, res) => {

    console.log('hello');
    res.render('signup', {
        page: 'signup',
        title: 'Sign up'
    });
});
// Sign in Page
router.get('/user/signin', (req, res) => {
    res.render('signin', {
        page: 'signin',
        title: 'Sign in'
    });
});

// Sign in Handle
router.post('/user/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/signin',
        failureFlash: true
    })(req, res, next);
});

// Sign up Handle
router.post('/user/signup', (req, res) => {

    const {
        name,
        surname,
        username,
        description,
        password,
        confirm_password
    } = req.body;

    let errors = [];

    // Check passwords match

    if (password !== confirm_password) errors.push({
        msg: "Passwords do not match!"
    });

    if (password && password.length < 6) errors.push({
        msg: 'Password should be at least 6 characters long'
    });

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            page: 'signup',
            title: 'Sign up',
            name,
            surname,
            username,
            description,
            password,
            confirm_password
        });

    } else {
        // Validation passed

        User.findOne({
            username: username
        }).then(user => {
            if (user) {
                // Student exist
                errors.push({
                    msg: 'Username is already in use.'
                });
                res.render('signup', {
                    errors,
                    page: 'signup',
                    title: 'Sign up',
                    name,
                    surname,
                    username,
                    description,
                    password,
                    confirm_password
                });
            } else {

                const newUser = new User({
                    name,
                    surname,
                    username,
                    description,
                    password
                });

                User.createUser(newUser, (err, user) => {
                    if (err)
                        console.log(err);

                    if (user) {
                        req.flash('success_msg', "You have signed up");
                        res.redirect('/user/signin');
                    }
                });

            }
        });
    }
});

module.exports = router;
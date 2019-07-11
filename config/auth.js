module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            req.flash('success_msg', 'You have signed in');
            return next();
        }
        res.redirect('/user/signin');
    }
}
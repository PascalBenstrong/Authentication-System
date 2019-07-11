const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

//  Passport Config

require('./config/passport')(passport);

//DB Config

const db = require('./config/keys').MongoURI;
// Connect to Mongo
mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err));

// EJS
app.use(expressLayouts)

// Bodyparser
app.use(express.urlencoded({
    extended: false
}));

// Express Session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global Vars

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//set up view engine
app.set('view engine', 'ejs');

// Set static folder/ public folders accessable to the browser
app.use(express.static(path.join(__dirname, 'public')));

// create home route
app.use('/', require('./routes/index'));

app.listen(PORT, console.log('app now listening for requests on port 3000'));
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var _ = require('underscore');
var passport = require('passport')
var session = require("express-session")
var flash    = require('express-flash')
var fs = require('fs')

var app = express();

app.use(favicon("./favicon.ico"))

require('underscore-express')(app);
app.engine('html',cons.underscore);
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'))

var dbClient = require('./app/db-client')
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(flash()) // use connect-flash for flash messages stored in session
// required for passport
app.use(session({
    secret: 'trackitimerules',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

// Pass moment.js to every template for date formatting
app.use(function(req, res, next){
    res.locals.moment = require('moment');
    next();
})

require('./routes/index')(app)
require('./routes/documentation')(app)
require('./routes/login')(app, passport)
require('./routes/signup')(app, passport)
require('./routes/logout')(app, passport)


var authenticateUser = require('./app/authenticateUser')

// After this the requests need being logged in
app.all('*', authenticateUser.isLoggedIn)

require('./routes/profile')(app)
require('./routes/project')(app)
require('./routes/instance')(app)
require('./routes/timeline')(app)

// After this the request require admin rights
app.all('*', authenticateUser.isAdmin)

require('./routes/user')(app)

var port = process.env.PORT || 8080

//server = https.createServer(https_options, app).listen(port);
app.listen(port, function() {
    console.log('Trackitime running on port ' + port + '!')
})


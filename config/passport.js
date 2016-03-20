var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var pg = require('pg');

module.exports = function(passport, db) {

    var User = require('../app/models/user')

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(user) {
            done(null, user)
        }, function(err) {
            done(new Error('User with the id ' + id +' does not exist'))
        })
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User.findByUsername(username, function(user) {
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    if(password != req.body.password2)
                        return done(null, false, req.flash('signupMessage', "Passwords don't match"))
                    var hashedPassword = bcrypt.hashSync(password, null, null)

                    User.create({
                        name: req.body.name,
                        username: username,
                        hashedPassword: hashedPassword
                    }, function(user) {
                        console.log('New user ' + req.body.name + ' (' + username + ') created!')
                        return done(null, user)
                    })
                }
            })
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) { // callback with email and password from our form
            User.findByUsername(username, function(user) {
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, user.password))
                    return done(null, false, req.flash('loginMessage', 'Password was incorrect.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                console.log(user.name + ' (' + user.username + ') logged in!')
                return done(null, user);
            })
        })
    )
}

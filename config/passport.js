"use strict";

var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

    var User = require('../app/models/user')

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(function(user) {
                done(null, user)
            })
            .catch(function(err) {
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
            User.findByUsername(username)
                .then(function(user) {
                    if (user) {
                        return done(null, false, req.flash('info', 'That username is already taken.'));
                    } else {
                        User.create(req.body)
                            .then(function(user) {
                                console.log('New user ' + req.body.name + ' (' + username + ') created!')
                                return done(null, user)
                            })
                            .catch(function(err) {
                                return done(null, false, req.flash('info', err.message))
                            })
                    }
                })
                .catch(function(err) {
                    return done(null, false, req.flash('info', err.message))
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
            User.findWithPasswordByUsername(username)
                .then(function(user) {
                    if (!user || !bcrypt.compareSync(password, user.password)) {
                        return done(null, false, req.flash('error', 'Username or password incorrect')); // req.flash is the way to set flashdata using connect-flash
                    }
                    // all is well, return successful user
                    console.log(user.name + ' (' + user.username + ') logged in!')
                    return done(null, {
                        name: user.name,
                        username: user.username,
                        id: user.id
                    });
                })
                .catch(function(err) {
                    return done(null, false, req.flash('info', err.message))
                })
        })
    )
}

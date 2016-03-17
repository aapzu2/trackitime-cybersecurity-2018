var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var pg = require('pg');

module.exports = function(passport, db) {

    var client = new pg.Client(db.host)
    client.connect(function(err) {
        if(err) throw err;
    })
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        client.query('SELECT * FROM "user" WHERE id = $1', [id], function(err, result) {
            if(err)
                done(new Error('User with the id ' + id +' does not exist'))
            done(null, result.rows[0])
        })
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            client.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result) {
                if(err) throw err;
                if (result.rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    var hashedPassword = bcrypt.hashSync(password, null, null)

                    client.query('INSERT INTO "user" (name, username, password) values ($1, $2, $3) RETURNING id',[req.body.name, username, hashedPassword], function(err, result) {
                        if(err) throw err;
                        return done(null, {
                            id: result.rows[0].id
                        })
                    })
                }
            })
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            client.query('SELECT * FROM "user" WHERE username = $1',[username], function(err, result) {
                if(err) throw err;
                if (!result.rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, result.rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, result.rows[0]);
            })
        })
    );
};


module.exports = function(app, passport) {

    app.get('/login', function(req, res, next) {
        res.render('login.tmpl', { message: req.flash ? req.flash('loginMessage') : "" });
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log(req.user.name + ' (' + req.user.username + ') logged in!');

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    return this
}

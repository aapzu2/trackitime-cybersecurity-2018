
module.exports = function(app, passport) {

    app.get('/login', function(req, res, next) {
        var message = req.flash ? req.flash('loginMessage') : undefined
        res.render('login/login.tmpl', { message: message });
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }))

    return this
}

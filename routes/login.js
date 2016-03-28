
module.exports = function(app, passport) {

    app.get('/login', function(req, res, next) {
        res.render('login/login.tmpl', {
            title: "Login"
        });
    });

    app.post('/login', passport.authenticate('local-login', {
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }), function(req, res) {
            if(req.session.returnUrl) {
                res.redirect(req.session.returnUrl)
            } else {
                res.redirect('/dashboard')
            }
        })

    return this
}

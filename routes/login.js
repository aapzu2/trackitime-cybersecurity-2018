
module.exports = function(app, passport) {

    app.get('/login', function(req, res, next) {
        res.render('login/login.tmpl', {
            title: "Login"
        });
    });

    app.post('/login', passport.authenticate('local-login', {
            failureRedirect : '/login', // redirect back to the login page if there is an error
        }), function(req, res) {
            if(req.session.returnUrl) {
                res.redirect(req.session.returnUrl)
                req.session.returnUrl = undefined
            } else {
                res.redirect('/')
            }
        })

    return this
}

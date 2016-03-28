
module.exports = function(app, passport) {

    app.get('/signup', function(req, res, next) {
        res.render('signup/signup.tmpl', {
            title: "Sign up"
        });
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    return this
}
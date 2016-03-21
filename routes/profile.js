
module.exports = function(app, passport) {

    app.get('/profile/edit', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'profile/profile-edit',
            user: req.user,
            message: req.flash('profileEditError')
        })
    })

    app.post('/profile/edit', function(req, res, next) {

    })

    return this
}

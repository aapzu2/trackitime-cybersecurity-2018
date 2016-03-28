
module.exports = function(app) {

    app.get('/dashboard', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'dashboard/dashboard',
            title: "Dashboard",
            data: {
                user: req.user
            }
        })
    })

    return this
}

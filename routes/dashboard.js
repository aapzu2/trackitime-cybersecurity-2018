
module.exports = function(app) {

    app.get('/dashboard', function(req, res, next) {
        res.render('dashboard.tmpl', {user: req.user});
    });

    return this
}


module.exports = function(app) {

    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy()
        res.redirect('/');
    });

    return this
}

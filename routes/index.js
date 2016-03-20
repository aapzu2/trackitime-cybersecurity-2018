
module.exports = function(app) {

    app.get('/', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'index/index',
            user: req.user
        });
    });

    return this
}

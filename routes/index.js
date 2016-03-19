
module.exports = function(app) {

    app.get('/', function(req, res, next) {
        res.render('index.tmpl', {
            user: req.user
        });
    });

    return this
}

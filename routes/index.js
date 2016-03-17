
module.exports = function(app) {

    app.get('/', function(req, res, next) {
        res.render('index.tmpl', { title: 'Express', user: req.user});
    });

    return this
}

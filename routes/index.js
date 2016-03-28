
module.exports = function(app) {

    app.get('/', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'index/index',
            title: "Frontpage",
            data: {
                user: req.user
            }
        });
    });

    return this
}

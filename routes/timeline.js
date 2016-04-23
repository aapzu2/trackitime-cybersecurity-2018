
module.exports = function(app) {

    var Instance = require('../models/instance');

    app.get('/timeline', function(req, res, next) {
        Instance.findAllByUser(req.user)
            .then(function(instances) {
                res.render('main.tmpl', {
                    view: 'timeline/timeline',
                    title: "Your timeline",
                    data: {
                        user: req.user,
                        instances: instances
                    }
                })
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
            })
    });

    return this
}


module.exports = function(app) {
    var Project = require('../models/project')

    app.get('/', function(req, res) {
        function render(projects) {
            res.render('main.tmpl', {
                view: 'index/index',
                title: "Trackitime",
                data: {
                    user: req.user,
                    projects: projects
                }
            })
        }
        if(req.user) {
            Project.findAllByUser(req.user)
                .then(render)
                .catch(function(err) {
                    req.flash('error', err.message)
                    res.redirect('back')
                })
        } else {
            render()
        }

    });

    return this
}

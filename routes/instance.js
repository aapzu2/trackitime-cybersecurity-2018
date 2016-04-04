
module.exports = function(app, passport) {
    var moment = require('moment')

    var Project = require('../app/models/project')
    var Instance = require('../app/models/instance');

    app.get('/instance/create', function(req, res, next) {
        var p = req.param('project')
        Project.findAllByUser(req.user, function(projects) {
            res.render('main.tmpl', {
                view: 'instance/instance-create',
                title: "Create new instance",
                data: {
                    user: req.user,
                    projects: projects,
                    project: p
                }
            })
        })
    })

    app.get('/instance/list', function(req, res, next) {
        Instance.findAllByUser(req.user, function(instances) {
            res.render('main.tmpl', {
                view: 'instance/instance-list',
                title: "Your timeline",
                data: {
                    user: req.user,
                    instances: instances
                }
            })
        })
    })

    return this
}

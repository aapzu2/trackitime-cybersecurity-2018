
module.exports = function(app, passport) {
    var moment = require('moment')

    var Project = require('../app/models/project')
    var Instance = require('../app/models/instance');

    app.get('/instance/create', function(req, res) {
        var p = req.params.project
        Project.findAllByUser(req.user)
            .then(function(projects) {
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

    app.post('/instance/create', function(req, res) {
        var params = req.body
        params.user = req.user
        Instance.create(params)
            .then(function() {
                req.flash('info', 'New instance created!')
                res.redirect('/project/show/'+params.project)
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
            })
    })

    app.get('/instance/list', function(req, res, next) {
        if(req.params.project) {
            Instance.findAllByProjectAndUser(req.params.project, req.user)
                .then(success)
                .catch(error)
        } else {
            Instance.findAllByUser(req.user)
                .then(success)
                .catch(error)
        }
        function success(instances) {
            res.render('main.tmpl', {
                view: 'instance/instance-list',
                title: "Instances",
                data: {
                    user: req.user,
                    instances: instances,
                    project: req.params.project !== undefined ? {
                        id: instances[0].project,
                        name: instances[0].projectname
                    } : undefined
                }
            })
        }
        function error(err) {
            req.flash('error', err.message)
            res.redirect('back')
        }
    })
    
    app.post('/instance/delete', function(req, res, next) {
        function errorHandler(err) {
            req.flash('error', err.message)
            res.redirect('back')
        }
        function successHandler() {
            req.flash('info', "Instance deleted succesfully!")
            res.redirect("back")
        }
        Instance.findByIdAndUser(req.body.id, req.user)
            .then(function(instance) {
                if(instance) {
                    if(instance.isProjectAdmin) {
                        Instance.deleteByProjectAdmin(instance.id, req.user)
                            .then(successHandler)
                            .catch(errorHandler)
                    } else if(instance.user === req.user.id) {
                        Instance.deleteByProjectMember(instance.id, req.user)
                            .then(successHandler)
                            .catch(errorHandler)
                    }
                } else {
                    res.statusCode = 404
                    res.send("Not found")
                }
            })
            .catch(errorHandler)
    })

    return this
}

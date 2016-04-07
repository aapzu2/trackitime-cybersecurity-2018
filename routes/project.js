
module.exports = function(app) {

    var moment = require('moment')
    var Project = require('../app/models/project')
    var Instance = require('../app/models/instance')

    app.get('/project', function(req, res, next) {
        res.redirect('/project/list')
    })

    app.get('/project/list', function(req, res, next) {
        Project.findAllByUser(req.user, function(list) {
            res.render('main.tmpl', {
                view: 'project/project-list',
                title: "My Projects",
                data: {
                    user: req.user,
                    projects: list
                }
            })
        })
    })

    app.get('/project/create', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'project/project-create',
            title: "Create project",
            data: {
                user: req.user
            }
        })
    })

    app.post('/project/create', function(req, res, next) {
        Project.create({
            name: req.body.name,
            description: req.body.description,
            started: req.body.started,
            user: req.user.id
        }, function(row) {
            res.redirect('/project/show/' + row.id)
        }, function(err) {
            req.flash('error', err.message)
            res.redirect('/project/create')
        })
    })

    app.get('/project/show/:id', function(req, res, next) {
        var errorHandler = function(err) {
            req.flash('error', err.message)
            res.redirect('/project/list')
        }
        Project.findByUserAndId(req.params.id, req.user, function(project) {
            Instance.findAllByProjectAndUser(project.id, req.user, function(instances) {
                var total = 0
                instances.forEach(function(instance) {
                    var dur = moment(instance.to).diff(moment(instance.from))
                    instance.duration = moment.duration(dur).humanize()
                    total += moment(instance.to).diff(moment(instance.from))
                })
                Project.findOwnersByProject(project, function(owners) {
                    res.render('main.tmpl', {
                        view: 'project/project-show',
                        title: project.name,
                        data: {
                            user: req.user,
                            owners: owners,
                            project: project,
                            instances: instances,
                            totalUsed: moment.duration(total).humanize()
                        }
                    })
                }, errorHandler)
            }, errorHandler)
        }, errorHandler)
    })

    app.get('/project/share/:id', function(req, res) {
        Project.findByUserAndId(req.params.id, req.user, function(project) {
            res.render('main.tmpl', {
                view: 'project/project-share',
                title: "Share " + project.name,
                data: {
                    user: req.user,
                    project: project
                }
            })
        }, function(err) {
            req.flash('error', err.message)
            res.redirect('back')
        })
    })

    app.post('/project/share', function(req, res) {
        var errorHandler = function(err) {
            req.flash('error', err.message)
            res.redirect('back')
        }
        Project.shareToUser(req.body.id, req.body.username, function(project) {
            if(!project) {
                errorHandler(new Error("User " + req.body.username + " not found!"))
            } else {
                req.flash('info', "Project shared!")
                res.redirect('/project/show/' + project.id)
            }
        }, errorHandler)
    })

    return this
}

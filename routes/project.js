
module.exports = function(app) {

    var moment = require('moment')
    var Project = require('../models/project')
    var Instance = require('../models/instance')

    app.get('/project', function(req, res, next) {
        res.redirect('/project/list')
    })

    app.get('/project/list', function(req, res, next) {
        Project.findAllByUser(req.user)
            .then(function(list) {
                res.render('main.tmpl', {
                    view: 'project/project-list',
                    title: "My Projects",
                    data: {
                        user: req.user,
                        projects: list
                    }
                })
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
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
        })
            .then(function(row) {
                req.flash('info', "Project created successfully! You can now start creating instances to it.")
                res.redirect('/project/show/' + row.id)
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('/project/create')
            })
    })

    app.get('/project/edit/:id', function(req, res) {
        Project.findByUserAndId(req.user, req.params.id)
            .then(function(project) {
                if(!project) {
                    res.statusCode = 404
                    res.send("Not found")
                } else {
                    res.render('main.tmpl', {
                        view: 'project/project-edit',
                        title: "Edit project",
                        data: {
                            user: req.user,
                            project: project
                        }
                    })
                }
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
            })
    })

    app.post('/project/edit', function(req, res) {
        Project.edit({
            name: req.body.name,
            description: req.body.description,
            started: req.body.started,
            user: req.user.id,
            id: req.body.id
        })
            .then(function(rows) {
                req.flash('info', "Project edited succesfully!")
                res.redirect('/project/show/' + rows[0].id)
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('/project/edit/' + req.body.id)
            })
    })

    app.get('/project/show/:id', function(req, res, next) {
        Promise.all([
            Project.findByUserAndId(req.user, req.params.id),
            Instance.findAllByProjectAndUser(req.params.id, req.user),
            Project.findOwnersByProject(req.params.id)
        ])
            .then(function(values) {
                var project = values[0]
                var instances = values[1]
                var owners = values[2]

                if(!project) {
                    res.statusCode = 404
                    res.send("Not found")
                    return
                }

                res.render('main.tmpl', {
                    view: 'project/project-show',
                    title: project.name,
                    data: {
                        user: req.user,
                        owners: owners,
                        project: project,
                        instances: instances
                    }
                })
            })
            .catch(function(err){
                console.log(err.stack)
                req.flash('error', err.message)
                res.redirect('/project/list')
            })
    })

    app.get('/project/share/:id', function(req, res) {
        Project.findByUserAndId(req.user, req.params.id)
            .then(function(project) {
                if(project.isProjectAdmin) {
                    res.render('main.tmpl', {
                        view: 'project/project-share',
                        title: "Share " + project.name,
                        data: {
                            user: req.user,
                            project: project
                        }
                    })
                } else {
                    res.statusCode = 403
                    res.send("Not authorized")
                }
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
            })
    })

    app.post('/project/share', function(req, res) {
        var errorHandler = function(err) {
            req.flash('error', err.message)
            res.redirect('back')
        }
        Project.findByUserAndId(req.user, req.body.id)
            .then(function(project) {
                if (!project.isProjectAdmin) {
                    res.statusCode = 403
                    res.send("Not authorized")
                    return
                }
            })
            .catch(errorHandler)
        Project.shareToUser(req.body.id, req.body.username)
            .then(function(project) {
                if(!project) {
                    errorHandler(new Error("User " + req.body.username + " not found!"))
                } else {
                    req.flash('info', "Project shared!")
                    res.redirect('/project/show/' + project.id)
                }
            })
            .catch(errorHandler)
    })

    return this
}


module.exports = function(app) {

    var Project = require('../app/models/project')

    app.get('/project', function(req, res, next) {
        res.redirect('/project/list')
    })

    app.get('/project/list', function(req, res, next) {
        Project.findAllByUser(req.user, function(list) {
            res.render('main.tmpl', {
                view: 'project/project-list',
                user: req.user,
                projects: list
            })
        })
    })

    app.get('/project/create', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'project/project-create',
            user: req.user,
            message: req.flash('projectCreateError')
        })
    })

    app.post('/project/create', function(req, res, next) {
        Project.create({
            name: req.body.name,
            description: req.body.description,
            started: req.body.started,
            user: req.user.id
        }, function(project) {
            res.redirect('/project/show/' + project.id)
        }, function(err) {
            req.flash('projectCreateError', err.body)
            res.redirect('/project/create')
        })
    })

    app.get('/project/show/:id', function(req, res, next) {
        Project.findByUserAndId(req.params.id, req.user, function(project) {
            res.render('main.tmpl', {
                view: 'project/project-show',
                user: req.user,
                project: project
            })
        })
    })

    return this
}

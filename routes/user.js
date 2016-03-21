
module.exports = function(app) {

    var User = require('../app/models/user')

    app.get('/user', function(req, res, next) {
        res.redirect('/user/list')
    })

    app.get('/user/list', function(req, res, next) {
        User.findAll(function(list) {
            res.render('main.tmpl', {
                view: 'user/user-list',
                data: {
                    user: req.user,
                    users: list
                }
            })
        })
    })

    app.get('/user/create', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'user/user-create',
            message: req.flash('userCreateError'),
            data: {
                user: req.user
            }
        })
    })

    app.post('/user/create', function(req, res, next) {

    })

    app.get('/project/edit/:id', function(req, res, next) {
        Project.findById(req.params.id, function(foundUser) {
            res.render('main.tmpl', {
                view: 'user/user-show',
                data: {
                    user: foundUser,
                }
            })
        })
    })

    return this
}

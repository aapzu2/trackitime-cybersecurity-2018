
module.exports = function(app) {

    var User = require('../app/models/user')

    app.get('/user', function(req, res, next) {
        res.redirect('/user/list')
    })

    app.get('/user/list', function(req, res, next) {
        User.findAll(function(list) {
            res.render('main.tmpl', {
                view: 'user/user-list',
                title: "All Users",
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
            title: "Create User",
            data: {
                user: req.user
            }
        })
    })

    app.post('/user/create', function(req, res, next) {
        User.create(req.body, function(row) {
            req.flash("info", "User " + row.id + " created!")
            res.redirect('/user/list')
        }, function(err) {
            var msg
            if(err.code = 23514) {
                msg = "The username cannot be empty"
            } else {
                msg = err.message
            }
            req.flash("error", msg)
            res.redirect('back')
        })
    })

    app.get('/user/edit/:id', function(req, res, next) {
        User.findById(req.params.id, function(foundUser) {
            res.render('main.tmpl', {
                view: 'user/user-edit',
                title: "Edit foundUser.username",
                data: {
                    user: req.user,
                    editableUser: foundUser
                }
            })
        })
    })

    app.post('/user/edit', function(req, res, next) {
        User.edit(req.body, function(row) {
            req.flash('info', "User updated successfully!")
            res.redirect('back')
        }, function(err) {
            req.flash('error', err.message)
            res.redirect('back')
        })
    })

    app.post('/user/delete', function(req, res, next) {
        User.delete(req.body.id, function() {
            req.flash('info', "User " + req.body.id + " deleted successfully!")
            res.redirect('/user/list')
        }, function(err) {
            req.flash('error', err.message)
            res.redirect('back')
        })
    })

    return this
}

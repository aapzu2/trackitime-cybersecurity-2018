
module.exports = function(app) {

    var User = require('../app/models/user')

    app.get('/user', function(req, res, next) {
        res.redirect('/user/list')
    })

    app.get('/user/list', function(req, res, next) {
        User.findAll()
            .then(function(list) {
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
        User.create(req.body)
            .then(function(row) {
                req.flash("info", "User " + row.id + " created!")
                res.redirect('/user/list')
            })
            .catch(function(err) {
                req.flash("error", err.message)
                res.redirect('back')
            })
    })

    app.get('/user/edit/:id', function(req, res, next) {
        User.findById(req.params.id)
            .then(function(foundUser) {
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
        User.editByAdmin(req.body)
            .then(function(row) {
                req.flash('info', "User updated successfully!")
                res.redirect('back')
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
            })
    })

    app.post('/user/delete', function(req, res, next) {
        User.delete(req.body.id)
            .then(function() {
                req.flash('info', "User " + req.body.id + " deleted successfully!")
                res.redirect('/user/list')
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
            })
    })

    return this
}

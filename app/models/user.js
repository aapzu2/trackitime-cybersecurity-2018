"use strict";

var bcrypt = require('bcrypt-nodejs')
var client = require('../db-client')

function User() {}

User.prototype.findById = function(id) {
    return new Promise(function(resolve, reject) {
        client.first('' +
            'SELECT id, username, name, "isAdmin" FROM "User" WHERE id = $1',
            [id])
            .then(resolve)
            .catch(reject)
    })

}

User.prototype.findByUsername = function(username) {
    return new Promise(function(resolve, reject) {
        client.first('' +
            'SELECT id, username, name, "isAdmin" FROM "User" WHERE username = $1',
            [username])
            .then(resolve)
            .catch(reject)
    })
}

User.prototype.findWithPasswordByUsername = function(username) {
    return new Promise(function(resolve, reject) {
        client.first('' +
            'SELECT * FROM "User" WHERE username = $1',
            [username])
            .then(resolve)
            .catch(reject)
    })
}

User.prototype.findAll = function() {
    return new Promise(function(resolve, reject) {
        client.query('SELECT id, username, name, "isAdmin" FROM "User"')
            .then(resolve)
            .catch(reject)
    })
}

User.prototype.create = function(data) {
    return new Promise(function(resolve, reject) {
        if(data.password != data.password2) {
            reject(new Error("Passwords don't match!"))
        }
        else if(!data.username) {
            reject(new Error("Username cannot be empty!"))
        } else {
            var hashedPassword = bcrypt.hashSync(data.password, null, null)
            client.first('' +
                'INSERT INTO "User" (name, username, password) values ($1, $2, $3) RETURNING id',
                [data.name, data.username, hashedPassword])
                .then(resolve)
                .catch(reject)
        }

    })
}

User.prototype.delete = function(id) {
    return new Promise(function(resolve, reject) {
        client.query('' +
            'DELETE FROM "User" WHERE id = $1',
            [id])
            .then(resolve)
            .catch(reject)
    })
}

User.prototype.edit = function(data) {
    var _this = this
    return new Promise(function(resolve, reject) {
        var constString = ""
        var id = data.id
        var name = data.name
        var oldPwd = data.oldPassword
        var pwd = data.password
        var pwd2 = data.password2

        var err
        _this.findById(id)
            .then(function(user) {
                if(pwd || oldPwd) {
                    if (!bcrypt.compareSync(oldPwd, user.password))
                        reject(new Error("Wrong old password"))
                    else if(pwd != pwd2)
                        reject(new Error("Passwords don't match!"))
                    var hashedPassword = bcrypt.hashSync(data.password, null, null)

                    constString += "password='" + hashedPassword + "', "
                }
                constString += "name='" + name + "'"
                client.query('' +
                    'UPDATE "User" SET ' + constString + 'WHERE "id" = $1',
                    [id])
                    .then(resolve)
                    .catch(reject)
            })
            .catch(reject)
    })
}

User.prototype.editByAdmin = function(data) {
    return new Promise(function(resolve, reject) {
        var constString = ""
        var id = data.id

        var pwd = data.password
        if (pwd) {
            var hashedPassword = bcrypt.hashSync(data.password, null, null)
            constString += "password='" + hashedPassword + "', "
        }

        var name = data.name
        constString += "name='" + name + "', "

        var isAdmin = data.isAdmin ? true : false
        constString += "\"isAdmin\"='" + isAdmin + "' "

        client.query('' +
            'UPDATE "User" SET ' + constString + 'WHERE id = $1',
            [id])
            .then(resolve)
            .catch(reject)
    })
}

module.exports = new User()
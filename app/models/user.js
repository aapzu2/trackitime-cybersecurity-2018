var bcrypt = require('bcrypt-nodejs')

function User() {
    this.client = require('../db-client')
}

User.prototype.findById = function(id, successCallback, errorCallback) {
    this.client.first('SELECT * FROM "user" WHERE id = $1', [id], successCallback, errorCallback)
}

User.prototype.findByUsername = function(username, successCallback, errorCallback) {
    this.client.first('SELECT * FROM "user" WHERE username = $1', [username], successCallback, errorCallback)
}

User.prototype.findAll = function(successCallback, errorCallback) {
    this.client.query('SELECT * FROM "user"', [], successCallback, errorCallback)
}

User.prototype.create = function(data, successCallback, errorCallback) {
    if(data.password != data.password2) {
        var err = new Error("Passwords don't match!")
        if(errorCallback)
            errorCallback(err)
        else
            throw err
    } else {
        var hashedPassword = bcrypt.hashSync(data.password, null, null)
        this.client.first('INSERT INTO "user" (name, username, password) values ($1, $2, $3) RETURNING id',
            [data.name, data.username, hashedPassword], successCallback, errorCallback)
    }
}

User.prototype.delete = function(id, successCallback, errorCallback) {
    this.client.query('DELETE FROM "user" WHERE id = $1', [id], successCallback, errorCallback)
}

User.prototype.edit = function(data, successCallback, errorCallback) {
    var _this = this

    var constString = ""
    var username = data.username
    var name = data.name
    var oldPwd = data.oldPassword
    var pwd = data.password
    var pwd2 = data.password2

    var err
    this.findByUsername(username, function(row) {
        if(pwd || oldPwd) {
            if (!bcrypt.compareSync(oldPwd, row.password))
                err = new Error("Wrong old password")
            else if(pwd != pwd2)
                err = new Error("Passwords don't match!")

            var hashedPassword = bcrypt.hashSync(data.password, null, null)
            constString += "password='" + hashedPassword + "', "
        }
        if(err) {
            handleError(err)
        } else {
            constString += "name='" + name + "'"
            _this.client.query('UPDATE "user" SET ' + constString + 'WHERE "username" = $1', [username], successCallback, errorCallback)
        }

    }, function(err) {
        handleError(err)
    })

    var handleError= function(err) {
        if (errorCallback) {
            errorCallback(err)
        } else
            throw err
    }
}

User.prototype.editByAdmin = function(data, successCallback, errorCallback) {
    var constString = ""
    var username = data.username
    var name = data.name
    var pwd = data.password
    var isAdmin = data.isAdmin ? true : false

    if(pwd) {
        var hashedPassword = bcrypt.hashSync(data.password, null, null)
        constString += "password='" + hashedPassword + "', "
    }
    constString += "name='" + name + "', "
    constString += "\"isAdmin\"='" + isAdmin + "' "
    this.client.query('UPDATE "user" SET ' + constString + 'WHERE "username" = $1', [username], successCallback, errorCallback)
}

User.prototype.editField = function(field, value, username, successCallback, errorCallback) {
    this.client.first('UPDATE "' + field + '" = $1 WHERE "username" = $2', [value, username], successCallback, errorCallback)
}

module.exports = new User()
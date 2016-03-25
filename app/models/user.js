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
    var constString = ""
    var id = data.id
    data.id = undefined
    var i = 0
    Object.keys(data).forEach(function(key) {
        constString += key + "=" + data[key]
        if(i < Object.keys(data).length)
            constString += ","
        i++
    });
    this.client.query('UPDATE "user" SET ' + constString + 'WHERE id = ? RETURNING id', [id], successCallback, errorCallback)
}

module.exports = new User()
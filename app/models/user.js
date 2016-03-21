
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
    this.client.first('INSERT INTO "user" (name, username, password) values ($1, $2, $3) RETURNING id',
        [data.name, data.username, data.hashedPassword], successCallback, errorCallback)
}

User.prototype.delete = function(id, successCallback, errorCallback) {
    this.client.query('DELETE FROM "user" WHERE id = $1', [id], successCallback, errorCallback)
}

module.exports = new User()
var bcrypt = require('bcrypt-nodejs');
var pg = require('pg');

function User(db) {
    var DBClient = require('../db-client')
    this.client = new DBClient()
}

User.prototype.getUserById = function(id, successCallback, errorCallback) {
    this.client.query('SELECT * FROM "user" WHERE id = $1', [id], function(rows) {
        successCallback(rows[0])
    }, errorCallback)
}
User.prototype.getUserByUsername = function(username, successCallback, errorCallback) {
    this.client.query('SELECT * FROM "user" WHERE username = $1', [username], function(rows) {
        successCallback(rows[0])
    }, errorCallback)
}

User.prototype.getUsers = function(successCallback, errorCallback) {
    this.client.query('SELECT * FROM "user"', [], successCallback, errorCallback)
}

User.prototype.addUser = function(data, successCallback, errorCallback) {
    this.client.query('INSERT INTO "user" (name, username, password) values ($1, $2, $3) RETURNING id',
        [data.name, data.username, data.hashedPassword], function(rows) {
            successCallback(rows[0].id)
        }, errorCallback)
}

module.exports = User
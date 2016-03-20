
function Project() {
    this.client = require('../db-client')
}

Project.prototype.findById = function(id, successCallback, errorCallback) {
    this.client.first('SELECT * FROM "project" WHERE id = $1', [id], successCallback, errorCallback)
}

Project.prototype.findByUserAndId = function(id, user, successCallback, errorCallback) {
    var userId
    if(typeof user === 'object') {
        userId = user.id
    } else {
        userId = user
    }
    this.client.first('SELECT * FROM "project" WHERE id = $1 AND "user" = $2', [id, userId], successCallback, errorCallback)
}

Project.prototype.findAllByUser = function(user, successCallback, errorCallback) {
    var userId
    if(typeof user === 'object') {
        userId = user.id
    } else {
        userId = user
    }
    this.client.query('SELECT * FROM "project" WHERE project.user = $1', [userId], successCallback, errorCallback)
}

Project.prototype.findAll = function(successCallback, errorCallback) {
    this.client.query('SELECT * FROM "user"', [], successCallback, errorCallback)
}

Project.prototype.create = function(data, successCallback, errorCallback) {
    var userId
    if(typeof data.user === 'object') {
        userId = data.user.id
    } else {
        userId = data.user
    }
    this.client.first('INSERT INTO "project" (name, description, started, "user") values ($1, $2, $3, $4) RETURNING id',
        [data.name, data.description, data.started, userId], successCallback, errorCallback)
}

module.exports = new Project()
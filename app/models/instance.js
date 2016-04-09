
function Instance() {
    this.client = require('../db-client')
}

Instance.prototype.findById = function(id, successCallback, errorCallback) {
    this.client.first('SELECT * FROM "TimeInstance" WHERE id = $1', [id], successCallback, errorCallback)
}

Instance.prototype.findAllByUser = function(user, successCallback, errorCallback) {
    var userId
    if(typeof user === 'object') {
        userId = user.id
    } else {
        userId = user
    }
    this.client.query('' +
        'SELECT ' +
        'p.id AS projectId, p.name AS projectName, ' +
        'u.id AS userId, u.name AS userName, u.username AS userUsername, ' +
        'i.id, i.description, i.from, i.to ' +
        'FROM "UserProject" up ' +
        'JOIN "Project" p ON up.project = p.id ' +
        'JOIN "TimeInstance" i ON p.id = i.project ' +
        'JOIN "User" u ON i.user = u.id ' +
        'WHERE up.user = $1 ' +
        'ORDER BY "from" DESC', [userId], successCallback, errorCallback)
}

Instance.prototype.findAllByProjectAndUser = function(project, user, successCallback, errorCallback) {
    var userId
    var projectId
    if(typeof user === 'object') {
        userId = user.id
    } else {
        userId = user
    }
    if(typeof project === 'object') {
        projectId = project.id
    } else {
        projectId = project
    }
    this.client.query('' +
        'SELECT * FROM "TimeInstance" t ' +
        'JOIN "UserProject" u ON t.project = u.project ' +
        'WHERE t.project = $1 AND u.user = $2 ' +
        'ORDER BY "from" DESC', [projectId, userId], successCallback, errorCallback)
}

Instance.prototype.findAll = function(successCallback, errorCallback) {
    this.client.query('SELECT * FROM "TimeInstance"', [], successCallback, errorCallback)
}

Instance.prototype.delete = function(instanceId, successCallback, errorCallback) {
    _this.client.first('DELETE FROM TimeInstance WHERE id = $1', [instanceId], successCallback, errorCallback)
}

Instance.prototype.create = function(data, successCallback, errorCallback) {
    var _this = this

    var e
    if(!data.project) {
        e = new Error('Instance needs a project')
    }
    if(!data.user) {
        e = new Error("Instance needs a user")
    }
    if(e) {
        if (errorCallback)
            errorCallback(e)
        else
            throw e
    } else {
        this.client.first('SELECT * FROM "UserProject" WHERE "user" = $1', [data.user.id], function(row) {
            if(!row) {
                var e = new Error('Invalid project')
                if (errorCallback)
                    errorCallback(e)
                else
                    throw e
            } else {
                _this.client.query('' +
                    'INSERT INTO "TimeInstance" ("description", "from", "to", "project", "user") ' +
                    'VALUES ($1, $2, $3, $4, $5)', [data.description, data.from, data.to, data.project, data.user.id !== undefined ? data.user.id : data.user], successCallback, errorCallback)
            }
        })
    }

}

module.exports = new Instance()
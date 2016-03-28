
function Project() {
    this.client = require('../db-client')
}

Project.prototype.findById = function(id, successCallback, errorCallback) {
    this.client.first('SELECT * FROM "Project" WHERE id = $1', [id], successCallback, errorCallback)
}

Project.prototype.findByUserAndId = function(id, user, successCallback, errorCallback) {
    var userId
    if(typeof user === 'object') {
        userId = user.id
    } else {
        userId = user
    }
    this.client.first('' +
        'SELECT "Project".* FROM "Project" ' +
        'INNER JOIN "UserProject" ON "Project".id = "UserProject".project ' +
        'WHERE "UserProject".project = $1 AND "UserProject".user = $2', [id, userId], successCallback, errorCallback)
}

Project.prototype.findAllByUser = function(user, successCallback, errorCallback) {
    var userId
    if(typeof user === 'object') {
        userId = user.id
    } else {
        userId = user
    }
    this.client.query('' +
        'SELECT "Project".* FROM "Project" ' +
        'INNER JOIN "UserProject" ON "Project".id = "UserProject".project ' +
        'WHERE "UserProject".user = $1', [userId], successCallback, errorCallback)
}

Project.prototype.findAll = function(successCallback, errorCallback) {
    this.client.query('SELECT * FROM "Project"', [], successCallback, errorCallback)
}

Project.prototype.create = function(data, successCallback, errorCallback) {
    var _this = this
    var err
    if(data.name === "") {
        err = new Error("Project name cannot be empty!")
    }
    if(!data.started.match(/\b\d{4}-\d{2}-?\d{2}\b/g)) {
        err = new Error("You must give a starting date!")
    }
    if(err) {
        if (errorCallback)
            errorCallback(err)
        else
            throw err
    } else {
        var userId
        if(typeof data.user === 'object') {
            userId = data.user.id
        } else {
            userId = data.user
        }
        this.client.first('INSERT INTO "Project" (name, description, started) VALUES ($1, $2, $3) RETURNING id', [data.name, data.description, data.started],
            function(row) {
                _this.client.first('' +
                    'INSERT INTO "UserProject" ("user", "project") ' +
                    'VALUES ($1, $2) RETURNING project AS id',
                    [userId, row.id], successCallback, errorCallback)
            }, errorCallback)
    }
}

Project.prototype.shareToUser = function(projectId, username, successCallback, errorCallback) {
    var _this = this
    var errorHandler = function(err) {
        if(errorCallback)
            errorCallback(err)
        else
            throw err
    }
    if(username === "")
        errorHandler(new Error("Username cannot be empty!"))
    else
        this.client.first('SELECT * FROM "User" WHERE username = $1', [username], function(user) {
            if(!user) {
                successCallback(undefined)
            } else {
                _this.client.first('SELECT * FROM "UserProject" WHERE user = $1 AND project = $2', [user.id, projectId], function(row) {
                    if(row === undefined) {
                        _this.client.first('' +
                            'INSERT INTO "UserProject" ("user", "project") ' +
                            'VALUES ($1, $2) RETURNING project AS id',
                            [user.id, projectId], successCallback, errorHandler)
                    } else {
                        successCallback({
                            id:projectId
                        })
                    }
                })

            }
        }, errorHandler)

}

Project.prototype.delete = function(projectId, successCallback, errorCallback) {
    var _this = this
    this.client.query('DELETE FROM "UserProject" WHERE project = $1', [projectId], function() {
        _this.client.first('' +
            'DELETE FROM "Project" WHERE id = $1', [projectId], successCallback, errorCallback)
    }, errorCallback)
}

Project.prototype.deleteFromUser = function(projectId, userId, successCallback, errorCallback) {
    var _this = this
    this.client.query('DELETE FROM "UserProject" WHERE user = $1 AND project = $2', [userId, projectId], function() {
        _this.client.query('' +
            'SELECT * FROM "UserProject" WHERE project = $1', [projectId], function(rows) {
            if(!rows.length) {
                _this.client.first('' +
                    'DELETE FROM "Project" WHERE id = $1', [projectId], successCallback, errorCallback)
            }
        }, errorCallback)
    }, errorCallback)
}

Project.prototype.findOwnersByProject = function(project, successCallback, errorCallback) {
    var projectId
    if(typeof project === 'object') {
        projectId = project.id
    } else {
        projectId = project
    }
    this.client.query('' +
        'SELECT "User".id, "User".username, "User".name FROM "UserProject" ' +
        'JOIN "User" ON "User".id = "UserProject".user ' +
        'WHERE "UserProject".project = $1', [projectId], successCallback, errorCallback)
}

module.exports = new Project()
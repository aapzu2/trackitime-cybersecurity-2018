"use strict";

var Project = require('./project')
var client = require('../db-client')

function Instance() {}

Instance.prototype.findById = function(id) {
    return new Promise(function(resolve, reject) {
        client.first('SELECT * FROM "TimeInstance" WHERE id = $1', [id])
            .then(resolve)
            .catch(reject)
    })

}

Instance.prototype.findAllByUser = function(user) {
    return new Promise(function(resolve, reject) {
        client.query('' +
            'SELECT ' +
            'p.id AS projectId, p.name AS projectName, ' +
            'u.id AS userId, u.name AS userName, u.username AS userUsername, ' +
            'i.id, i.description, i.from, i.to ' +
            'FROM "UserProject" up ' +
            'JOIN "Project" p ON up.project = p.id ' +
            'JOIN "TimeInstance" i ON p.id = i.project ' +
            'JOIN "User" u ON i.user = u.id ' +
            'WHERE up.user = $1 ' +
            'ORDER BY "from" DESC', [user.id !== undefined ? user.id : user])
            .then(resolve)
            .catch(reject)
    })
}

Instance.prototype.findAllByProjectAndUser = function(project, user, successCallback, errorCallback) {
    return new Promise(function(resolve, reject) {
        client.query('' +
            'SELECT * FROM "TimeInstance" t ' +
            'JOIN "UserProject" u ON t.project = u.project ' +
            'WHERE t.project = $1 AND u.user = $2 ' +
            'ORDER BY "from" DESC',
            [project.id !== undefined ? project.id : project, user.id !== undefined ? user.id : user])
            .then(resolve)
            .catch(reject)
    })
}

Instance.prototype.findAll = function() {
    return new Promise(function(resolve, reject) {
        client.query('SELECT * FROM "TimeInstance"')
            .then(resolve)
            .catch(reject)
    })
}

Instance.prototype.delete = function(instance) {
    return new Promise(function (resolve, reject) {
        client.first('DELETE FROM TimeInstance WHERE id = $1',
            [instance.id !== undefined ? instance.id : instance])
            .then(resolve)
            .catch(reject)
    })
}

Instance.prototype.deleteByProjectMember = function(instance, user) {
    return new Promise(function (resolve, reject) {
        client.first('' +
            'DELETE FROM "TimeInstance" WHERE id = $1 AND user = $2' +
            [instance.id !== undefined ? instance.id : instance, user.id !== undefined ? user.id : user])
            .then(resolve)
            .catch(reject)
    })
}

Instance.prototype.deleteByProjectAdmin = function(instance, user) {
    return new Promise(function (resolve, reject) {
        client.first('' +
            'DELETE FROM "TimeInstance" t ' +
            'JOIN "Project" p ON t.project = p.id ' +
            'JOIN "UserProject" u ON u.project = p.id ' +
            'WHERE u.user = $1 AND t.id = $2',
            [user.id !== undefined ? user.id : user, instance.id !== undefined ? instance.id : instance])
            .then(resolve)
            .catch(reject)
    })
}


Instance.prototype.create = function(data) {
    return new Promise(function(resolve, reject) {
        if(!data.project) {
            reject(new Error('Instance needs a project'))
        }
        if(!data.user) {
            reject(new Error("Instance needs a user"))
        }
        Project.findById(data.project)
            .then(function(project) {
                if(!project) {
                    reject(new Error('Invalid project id!'))
                } else {
                    client.query('' +
                        'INSERT INTO "TimeInstance" ("description", "from", "to", "project", "user") ' +
                        'VALUES ($1, $2, $3, $4, $5)',
                        [data.description, data.from, data.to, data.project, data.user.id !== undefined ? data.user.id : data.user])
                        .then(resolve)
                }
            })
    })
}

module.exports = new Instance()
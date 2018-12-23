var moment = require('moment')
var Project = require('./project')
var client = require('../app/db-client')

function Instance() {}

Instance.prototype.findById = function(id) {
    return new Promise(function(resolve, reject) {
        client.first('' +
            'SELECT * FROM "TimeInstance" WHERE id = ?',
            [id])
            .then(resolve)
            .catch(reject)
    })
}

Instance.prototype.findByIdAndUser = function(id, user) {
    return new Promise(function(resolve, reject) {
        client.first('' +
            'SELECT t.*, p.id AS "projectId", p.name AS "projectName", up."isAdmin" AS "isProjectAdmin" ' +
            'FROM "TimeInstance" t ' +
            'JOIN "Project" p ON p.id = t.project ' +
            'JOIN "UserProject" up ON up.project = p.id ' +
            'WHERE t.id = ? AND t.user = ?',
            [id, user.id !== undefined ? user.id : user])
            .then(resolve)
            .catch(reject)
    })
}

Instance.prototype.findAllByUser = function(user) {
    return client.query('' +
        'SELECT ' +
        'p.id AS "projectId", Project.name AS "projectName", ' +
        'u.id AS "userId", u.name AS "userName", u.username AS "userUsername", ' +
        'TimeInstance.id, TimeInstance.description, TimeInstance.from, TimeInstance.to, ' +
        'UserProject."isAdmin" AS "isProjectAdmin" ' +
        'FROM "UserProject" ' +
        'JOIN "Project" ON UserProject.project = Project.id ' +
        'JOIN "TimeInstance" ON Project.id = i.project ' +
        'JOIN "User" ON i.user = User.id ' +
        'WHERE UserProject.user = ? ' +
        'ORDER BY "from" DESC', [user.id !== undefined ? user.id : user])
}

Instance.prototype.findAllByProjectAndUser = function(project, user) {
    return client.query('' +
        'SELECT TimeInstance.*, "duration" AS "duration", Project.name AS "projectName", UserProject."isAdmin" AS "isProjectAdmin", User."username" AS "userUsername", User.id AS "userId" ' +
        'FROM "TimeInstance" ' +
        'JOIN "UserProject" ON TimeInstance.project = UserProject.project ' +
        'JOIN "Project" on TimeInstance.project = Project.id ' +
        'JOIN "User" on User.id = UserProject.user ' +
        'WHERE TimeInstance.project = ? AND UserProject.user = ? ' +
        'ORDER BY "from" DESC',
        [typeof project.id !== 'undefined' ? project.id : project, user.id !== undefined ? user.id : user])
}

Instance.prototype.findAll = function() {
    return client.query('SELECT * FROM "TimeInstance"')
}

Instance.prototype.delete = function(instance) {
    return client.first('DELETE FROM "TimeInstance" WHERE id = ?',
        [instance.id !== undefined ? instance.id : instance])
}

Instance.prototype.deleteByProjectMember = function(instance, user) {
    return client.first('' +
        'DELETE FROM "TimeInstance" WHERE id = ? AND user = ?' +
        [instance.id !== undefined ? instance.id : instance, user.id !== undefined ? user.id : user])
}

Instance.prototype.deleteByProjectAdmin = function(instance, user) {
    return client.first('' +
        'DELETE FROM "TimeInstance" t ' +
        'USING "Project" AS p, "UserProject" AS up ' +
        'WHERE t.project = p.id ' +
        'AND up.project = p.id ' +
        'AND up.user = ? AND t.id = ?',
        [user.id !== undefined ? user.id : user, instance.id !== undefined ? instance.id : instance])
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
                        'VALUES (?, ?, ?, ?, ?)',
                        [data.description, moment.utc(data.from, "DD.MM.YYYY HH:mm").format('YYYY-MM-DD HH:mm:ss'), moment.utc(data.to, "DD.MM.YYYY HH:mm").format('YYYY-MM-DD HH:mm:ss'), data.project, data.user.id !== undefined ? data.user.id : data.user])
                        .then(resolve)
                        .catch(reject)
                }
            })
            .catch(reject)
    })
}

module.exports = new Instance()
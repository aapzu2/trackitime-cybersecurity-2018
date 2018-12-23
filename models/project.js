"use strict";

var client = require('../app/db-client')

function Project() {}

Project.prototype.findById = function(id) {
    return new Promise(function(resolve, reject) {
        client.first('SELECT * FROM "Project" WHERE id = ?', [id])
            .then(resolve)
            .catch(reject)
    })
}

Project.prototype.findByUserAndId = function(user, id) {
    return client.first('' +
        'SELECT p.*, UserProject."isAdmin" as "isProjectAdmin" ' +
        'FROM (' +
            'SELECT Project.*, SUM(TimeInstance."to" - TimeInstance."from") as "totalTimeUsed" ' +
            'FROM "Project" ' +
            'LEFT JOIN "TimeInstance" ON TimeInstance.project = Project.id ' +
            'GROUP BY Project.id' +
        ') AS p ' +
        'JOIN "UserProject" ON p.id = UserProject.project ' +
        'WHERE p.id = ? AND UserProject.user = ? ',
        [id, user.id !== undefined ? user.id : user])
}

Project.prototype.findAllByUser = function(user) {
    // TODO: Couldn't redo this functionality in Sqlite so I just stubbed it
    return client.query('' +
        'SELECT Project.*, UserProject."isAdmin" as "isProjectAdmin" ' +
        'FROM (' +
            'SELECT Project.*, SUM(TimeInstance."to" - TimeInstance."from") as "totalTimeUsed" ' +
            'FROM Project ' +
            'LEFT JOIN "TimeInstance" t ON t.project = p.id ' +
            'GROUP BY p.id' +
        ') AS p ' +
        'JOIN "UserProject" ON Project.id = UserProject.project ' +
        'WHERE UserProject.user = ?',
        // 'SELECT Project.*, UserProject."isAdmin" as "isProjectAdmin", 0 as "totalTimeUsed" ' +
        // 'FROM Project ' +
        // 'JOIN "UserProject" ON Project.id = UserProject.project ' +
        // 'WHERE UserProject.user = ?',
        [user.id !== undefined ? user.id : user])
}

Project.prototype.findAll = function() {
    return client.query('SELECT * FROM "Project"')
}

Project.prototype.create = function(data) {
    return new Promise(function(resolve, reject) {
        if(data.name === "") {
            reject(new Error("Project name cannot be empty!"))
        }
        if(!data.started.match(/\b\d{4}-\d{2}-?\d{2}\b/g)) {
            reject(new Error("You must give a starting date!"))
        }
        let projectId
        client.first('' +
            `INSERT INTO "Project" (name, description, started) VALUES ("${data.name}", "${data.description}", "${data.started}")`)
            .then(() => {
                return client.first('select last_insert_rowid() as id from Project')
            })
            .then(({ id }) => {
                projectId = id
                const query = `INSERT INTO "UserProject" ("user", "project") ` +
                    `VALUES (${data.user.id !== undefined ? data.user.id : data.user}, ${id})`
                return client.first(query)
            })
            .then(() => {
                resolve(projectId)
            })
            .catch(reject)
    })
}

Project.prototype.shareToUser = function(project, username) {
    return new Promise(function(resolve, reject) {
        if (username === "")
            reject(new Error("Username cannot be empty!"))
        else
            client.first('SELECT * FROM "User" WHERE username = ?',
                [username])
                .then(function (user) {
                    if (!user) {
                        reject(new Error('No user ' + username + ' found!'))
                    } else {
                        var projectId = project.id !== undefined ? project.id : project
                        client.first('SELECT * FROM "UserProject" WHERE user = ? AND project = ?',
                            [user.id, projectId])
                            .then(function (row) {
                                if (row === undefined) {
                                    client.first('' +
                                            'INSERT INTO "UserProject" ("user", "project", "isAdmin") ' +
                                            'VALUES (?, ?, false) RETURNING project AS id',
                                        [user.id, projectId])
                                        .then(resolve)
                                        .catch(reject)
                                } else {
                                    resolve({
                                        id: projectId
                                    })
                                }
                            })
                            .catch(reject)
                    }
                })
                .catch(reject)
    })
}

Project.prototype.delete = function(projectId) {
    return new Promise(function(resolve, reject) {
        client.query('DELETE FROM "UserProject" WHERE project = ?', [projectId])
            .then(function() {
                client.first('' +
                        'DELETE FROM "Project" WHERE id = ?',
                    [projectId])
                    .then(resolve)
                    .catch(reject)
            })
            .catch(reject)
    })
}

Project.prototype.deleteFromUser = function(project, user) {
    return new Promise(function(resolve, reject) {
        var userId = user.id !== undefined ? user.id : user
        var projectId = project.id !== undefined ? project.id : project
        client.first('DELETE FROM "UserProject" WHERE "user" = ? AND "project" = ? RETURNING "project", "user", "isAdmin"', [userId, projectId])
            .then(function(removedUp) {
                if(removedUp) {
                    client.query('' +
                        'SELECT * FROM "UserProject" WHERE project = ?', [projectId])
                        .then(function(userProjects) {
                            // If was the only one
                            if (!userProjects.length) {
                                client.first('' +
                                        'DELETE FROM "Project" WHERE id = ?', [projectId])
                                    .then(resolve)
                                    .catch(reject)
                            } else if (removedUp.isAdmin) {
                                client.first('' +
                                    'UPDATE "UserProject" ' +
                                    'SET "isAdmin" = \'true\' ' +
                                    'WHERE "user" = ? AND "project" = ?',
                                    [userProjects[0].user, projectId])
                                    .then(resolve)
                                    .catch(reject)
                            } else {
                                resolve()
                            }
                        })
                        .catch(reject)
                } else {
                    reject(new Error("No project found!"))
                }
            })
            .catch(reject)
    })
}

Project.prototype.findOwnersByProject = function(project) {
    return client.query('' +
        'SELECT "User".id, "User".username, "User".name ' +
        'FROM "UserProject" ' +
        'JOIN "User" ON "User".id = "UserProject".user ' +
        'WHERE "UserProject".project = ?',
        [project.id !== undefined ? project.id : project])
}

Project.prototype.findAdminByProject = function(project) {
    return client.first('' +
        'SELECT User.id, User.username, User.name ' +
        'FROM "UserProject" ' +
        'JOIN "User" ON User.id = UserProject.user ' +
        'WHERE UserProject.project = ? AND UserProject."isAdmin" = true',
        [project.id !== undefined ? project.id : project])
}

Project.prototype.edit = function(data) {
    var _this = this
    return new Promise(function(resolve, reject) {
        if(!data.name)
            reject(new Error("Project name cannot be empty!"))
        _this.findByUserAndId(data.user, data.id)
            .then(function(project) {
                if(!project || !project.isProjectAdmin)
                    reject(new Error("Not authorized to edit!"))
                else {
                    client.query('' +
                        'UPDATE "Project" ' +
                        'SET "name" = ?, "description" = ?, "started" = ? ' +
                        'WHERE "id" = ? ' +
                        'RETURNING "id"',
                        [data.name, data.description, data.started, data.id])
                        .then(resolve)
                        .catch(reject)
                }
            })
            .catch(reject)
    })
}

module.exports = new Project()
"use strict";

var client = require('../db-client')

function Project() {}

Project.prototype.findById = function(id) {
    return new Promise(function(resolve, reject) {
        client.first('SELECT * FROM "Project" WHERE id = $1', [id])
            .then(resolve)
            .catch(reject)
    })
}

Project.prototype.findByUserAndId = function(id, user) {
    return new Promise(function(resolve, reject) {
        client.first('' +
            'SELECT "Project".*, "UserProject"."isAdmin" as projectAdmin FROM "Project" ' +
            'INNER JOIN "UserProject" ON "Project".id = "UserProject".project ' +
            'WHERE "UserProject".project = $1 AND "UserProject".user = $2',
            [id, user.id !== undefined ? user.id : user])
            .then(resolve)
            .catch(reject)
    })
}

Project.prototype.findAllByUser = function(user) {
    return new Promise(function(resolve, reject) {
        client.query('' +
            'SELECT "Project".* FROM "Project" ' +
            'INNER JOIN "UserProject" ON "Project".id = "UserProject".project ' +
            'WHERE "UserProject".user = $1', [user.id !== undefined ? user.id : user])
            .then(resolve)
            .catch(reject)
    })
}

Project.prototype.findAll = function() {
    return new Promise(function(resolve, reject) {
        client.query('SELECT * FROM "Project"')
            .then(resolve)
            .catch(reject)
    })
}

Project.prototype.create = function(data) {
    return new Promise(function(resolve, reject) {
        if(data.name === "") {
            reject(new Error("Project name cannot be empty!"))
        }
        if(!data.started.match(/\b\d{4}-\d{2}-?\d{2}\b/g)) {
            reject(new Error("You must give a starting date!"))
        }
        client.first('' +
            'INSERT INTO "Project" (name, description, started) VALUES ($1, $2, $3) RETURNING id',
            [data.name, data.description, data.started])
            .then(function(project) {
                client.first('' +
                    'INSERT INTO "UserProject" ("user", "project", "isAdmin") ' +
                    'VALUES ($1, $2, $3) RETURNING project AS id',
                    [data.user.id !== undefined ? data.user.id : data.user, project.id, data.isAdmin ? true : false])
                    .then(resolve)
                    .catch(reject)
            })
            .catch(reject)
    })
}

Project.prototype.shareToUser = function(project, username) {
    return new Promise(function(resolve, reject) {
        if (username === "")
            reject(new Error("Username cannot be empty!"))
        else
            client.first('SELECT * FROM "User" WHERE username = $1',
                [username])
                .then(function (user) {
                    if (!user) {
                        reject(new Error('No user ' + username + ' found!'))
                    } else {
                        var projectId = project.id !== undefined ? project.id : project
                        client.first('SELECT * FROM "UserProject" WHERE user = $1 AND project = $2',
                            [user.id, projectId])
                            .then(function (row) {
                                if (row === undefined) {
                                    client.first('' +
                                            'INSERT INTO "UserProject" ("user", "project", "isAdmin") ' +
                                            'VALUES ($1, $2, false) RETURNING project AS id',
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
        client.query('DELETE FROM "UserProject" WHERE project = $1', [projectId])
            .then(function() {
                client.first('' +
                        'DELETE FROM "Project" WHERE id = $1',
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
        client.query('' +
            'SELECT * FROM "UserProject" WHERE project = $1', [projectId])
            .then(function(userProjects) {
                client.query('DELETE FROM "UserProject" WHERE user = $1 AND project = $2', [userId, projectId])
                    .then(function() {
                        // If was the only one
                        if(userProjects.length == 1) {
                            client.first('' +
                                    'DELETE FROM "Project" WHERE id = $1', [projectId])
                                .then(resolve)
                                .catch(reject)
                        }
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}

Project.prototype.findOwnersByProject = function(project) {
    return new Promise(function(resolve, reject) {
        client.query('' +
            'SELECT "User".id, "User".username, "User".name FROM "UserProject" ' +
            'JOIN "User" ON "User".id = "UserProject".user ' +
            'WHERE "UserProject".project = $1',
            [project.id !== undefined ? project.id : project])
            .then(resolve)
            .catch(reject)
    })
}

module.exports = new Project()
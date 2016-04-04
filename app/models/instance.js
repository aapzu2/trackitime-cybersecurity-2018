
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
        'SELECT * FROM "TimeInstance" ORDERED BY started WHERE user = ?', [userId], successCallback, errorCallback)
}

Instance.prototype.findAll = function(successCallback, errorCallback) {
    this.client.query('SELECT * FROM "TimeInstance"', [], successCallback, errorCallback)
}

//Instance.prototype.create = function(data, successCallback, errorCallback) {
//    var _this = this
//    var err
//    if(data.name === "") {
//        err = new Error("Project name cannot be empty!")
//    }
//    if(!data.started.match(/\b\d{4}-\d{2}-?\d{2}\b/g)) {
//        err = new Error("You must give a starting date!")
//    }
//    if(err) {
//        if (errorCallback)
//            errorCallback(err)
//        else
//            throw err
//    } else {
//        var userId
//        if(typeof data.user === 'object') {
//            userId = data.user.id
//        } else {
//            userId = data.user
//        }
//        this.client.first('INSERT INTO "Project" (name, description, started) VALUES ($1, $2, $3) RETURNING id', [data.name, data.description, data.started],
//            function(row) {
//                _this.client.first('' +
//                    'INSERT INTO "UserProject" ("user", "project") ' +
//                    'VALUES ($1, $2) RETURNING project AS id',
//                    [userId, row.id], successCallback, errorCallback)
//            }, errorCallback)
//    }
//}

Instance.prototype.delete = function(instanceId, successCallback, errorCallback) {
    _this.client.first('DELETE FROM TimeInstance WHERE id = $1', [instanceId], successCallback, errorCallback)
}

module.exports = new Instance()
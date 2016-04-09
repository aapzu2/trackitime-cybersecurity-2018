"use strict";
function DBClient() {
    var pg = require('pg')

    pg.defaults.ssl = true
 
    var host = process.env.DATABASE_URL

    if(!host)
        throw "No DATABASE_URL!"

    this.client = new pg.Client(host)
    this.client.connect(function(err) {
        if(err) throw err;
    })
}

DBClient.prototype.query = function(query, params) {
    var _this = this
    return new Promise(function(resolve, reject) {
        _this.client.query(query, params, function(err, result) {
            if(err) {
                reject(err)
            } else {
                resolve(result.rows)
            }
        })
    })
}

DBClient.prototype.first = function(query, params) {
    var _this = this
    return new Promise(function(resolve, reject) {
        _this.query(query, params)
            .then(function(result) {
                resolve(result[0])
            })
            .catch(function(err) {
                reject(err)
            })
    })
}

module.exports = new DBClient()

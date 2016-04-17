"use strict";

var pg = require('pg')

function DBClient(url) {
    pg.defaults.ssl = true
    if(!this.connected) {
        this.connected = false
        this.connect(url)
    }
    return this
}

DBClient.prototype.connect = function(url) {
    var _this = this

    url = url || process.env.DATABASE_URL

    if(!url)
        throw new Error("No DATABASE_URL!")

    this.client = new pg.Client(url)
    this.client.connect(function(err) {
        if(err)
            throw err
        _this.connected = true
        console.log("Connected to the database succesfully!")
    })
    return this
}

DBClient.prototype.isConnected = function() {
    return this.connected
}

DBClient.prototype.query = function(query, params) {
    if(!this.isConnected)
        throw new Error("The client must be connected to make queries!")
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
    return this
}

DBClient.prototype.first = function(query, params) {
    if(!this.isConnected)
        throw new Error("The client must be connected to make queries!")
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
    return this
}

module.exports = new DBClient()


function DBClient() {
    var pg = require('pg')

    pg.defaults.ssl = true
 
    var host = process.env.DATABASE_URL

    var client = new pg.Client(host)
    client.connect(function(err) {
        if(err) throw err;
    })


    this.query = function(query, params, successCallback, errorCallback) {
        client.query(query, params, function(err, result) {
            if(err) {
                if(errorCallback !== undefined) {
                    errorCallback(err)
                } else {
                    throw err
                }
            } else if(successCallback) {
                successCallback(result.rows)
            }
        })
    }

    this.first = function(query, params, successCallback, errorCallback) {
        this.query(query, params, function(rows) {
            successCallback(rows[0])
        }, errorCallback)
    }
}

module.exports = new DBClient()

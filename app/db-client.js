
function DBClient() {
    var pg = require('pg')

    pg.defaults.ssl = true

    var host = process.env.DATABASE_URL || 'postgres://ixvgkdrmthzqod:ty0AGdMZfuzTA95XdOGvAsfLK7@ec2-54-243-149-147.compute-1.amazonaws.com:5432/d1edm9enke35bt'

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

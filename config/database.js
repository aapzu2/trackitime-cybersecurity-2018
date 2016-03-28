
var pg = require('pg')

pg.defaults.ssl = true

var host = process.env.DATABASE_URL
pg.connect(host, function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres succesfully!');
})

module.exports = {
    host: host
}
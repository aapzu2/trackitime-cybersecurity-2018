
var pg = require('pg')

pg.defaults.ssl = true

var host = process.env.DATABASE_URL || 'postgres://ixvgkdrmthzqod:ty0AGdMZfuzTA95XdOGvAsfLK7@ec2-54-243-149-147.compute-1.amazonaws.com:5432/d1edm9enke35bt'
pg.connect(host, function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres succesfully!');
})

module.exports = {
    host: host
}
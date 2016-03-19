
module.exports = function(app) {
    var fs = require('fs')
    app.get('/documentation', function(req, res, next) {
        var pdf = fs.readFileSync('doc/Trackitime-doc.pdf');

        res.type('application/pdf');
        res.end(pdf, 'binary');
    });

    return this
}

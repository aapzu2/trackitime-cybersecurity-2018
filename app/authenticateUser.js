
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page

    req.session.returnUrl = req.originalUrl
    res.redirect('/login');

    return this
}

function isAdmin(req, res, next) {
    if(req.isAuthenticated() && req.user.isAdmin === true) {
        return next();
    }

    // if they aren't redirect them to the home page

    res.statusCode = '404'
    res.send("Not found");

    return this
}

module.exports.isLoggedIn = isLoggedIn
module.exports.isAdmin = isAdmin
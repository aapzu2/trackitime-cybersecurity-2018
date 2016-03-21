
module.exports = function(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page

    req.session.returnUrl = req.originalUrl
    res.redirect('/login');

    return this
}
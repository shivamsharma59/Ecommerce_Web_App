
function isAdmin(req, res, next) {
    if (req.session.isLoggedIn && req.session.isAdmin) {
        next();
    } else {
        return res.render('authError', { status: 403, msg: 'You need an admin accout to access this page' });;
    }
}

module.exports = isAdmin;

function isAdmin(req, res, next) {
    if (req.session.isLoggedIn && req.session.isAdmin) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

module.exports = isAdmin;
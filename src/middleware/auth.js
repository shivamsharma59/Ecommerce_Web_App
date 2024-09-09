const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        console.log("Hi");
        return res.status(401).json({ msg: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;

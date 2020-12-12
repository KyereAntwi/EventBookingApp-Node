const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    if(!req.header('Authorization')) res.status(401).send('Access Denied');

    const list = req.header('Authorization').split(' ');
    const token = list[1];

    if(!token) res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, ';ksdjajsfkjdjfad9e7979875flkjdsfja098750$%&&');
        req.user = verified;
        next();

    } catch (error) {
        res.status(400).send('Invalid token');
    }
}

module.exports = auth;
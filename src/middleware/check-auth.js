const jwt = require('jsonwebtoken');
const env = process.env.JWT_KEY || 'database';
const config = require('../config/keys')[env];


module.exports = (req, res, next) => {
    try {
        console.log('req : ', req.headers.authorization)
        const token = req.headers.authorization.split(" ")[1];
        console.log('config.JWT_KEY : ', config.JWT_KEY)

        const decoded = jwt.verify(token, config.JWT_KEY);
        console.log('decoded : ', decoded)

        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            auth: false,
            message: 'Auth failed'
        });
    }

};
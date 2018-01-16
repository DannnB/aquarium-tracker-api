const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // get part after white space
        const decoded = jwt.verify(token, process.env.JWT_KEY) // only helpful if you want to get to internals of toek nAFTer variyfing
        req.userData = decoded; // use unique cosnt name
        
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    next(); // if authed success
};
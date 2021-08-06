const config = require('config');
const jwt = require('jsonwebtoken');

module.exports.auth = async(req, res, next)=>{
    //get the token from header
    const token = req.header('x-auth-token');

    //check if not token
    if(!token){
        return res.status(401).json({msg:'No token, Authorization denied'});
    }

    //Verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user
        next();
    } catch (error) {
        res.status(401).json({ msg:'Token is not valid '})
    }
}
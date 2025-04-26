const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header("x-access-token");

    if(!token){
        return res.status(403).json({success:false, message:"Please provide a token"});
    }

    try{
        const decode= jwt.verify(token, process.env.TOKEN_SECRET);

        req.user = decode.userId;
        next();
    }
    catch(err){
        return res.status(401).json({success:false, message:"Invalid Token"});
    }
}
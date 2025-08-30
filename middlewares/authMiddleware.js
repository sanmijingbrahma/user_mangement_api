const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


function authMiddleware(req,res,next){

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) res.status(401).json({error:"no token provided"});

    jwt.verify(token,JWT_SECRET,(err,decoded)=>{
       if(err) res.status(403).json({error:"invalid token"});
        req.user = decoded;
        next();
    })
}


module.exports = authMiddleware;

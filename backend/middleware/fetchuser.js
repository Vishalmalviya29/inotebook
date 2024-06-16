// middleware functionality to get user detailswith with the help of user id and authtoken
const jwt = require('jsonwebtoken')
const JWT_SECRET = "vishalisa$goodboy";

const fetchuser = (req, res, next) => {
    // ge the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({error: 'please authenticate using a validate token'})
    }
    
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;    
        next();
    }
    catch (error) {
        res.status(401).send({error: 'please authenticate using a validate token'})
    }
} 
module.exports = fetchuser;


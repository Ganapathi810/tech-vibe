const { admin } = require('../config/firebaseAdmin');

const authMiddleware = async (req,res,next) => {
    try {
        const isTokenStartsWithBearer = req.headers.authorization?.startsWith("Bearer ")
        if(!isTokenStartsWithBearer) {
            return res.status(401).json({
                message : "token must start with bearer"
            })
        }

        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                message : "token is required!"
            })
        }

        const decodedToken = await admin.auth().verifyIdToken(token)
        req.user = decodedToken;
        next()

    } catch(error) {
        console.log(error)
        res.status(401).json({message : "Invalid Token"});
    }
}

module.exports = authMiddleware;
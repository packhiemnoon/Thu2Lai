import jwt from 'jsonwebtoken';

export const requireAuth = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(token == undefined) {
        return res.status(401).json({message: 'Invalid token.'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userID;
        next();
    } catch (err) {
        return res.status(401).json({message: 'Invalid token.'});
    }
}   
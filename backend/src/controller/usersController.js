import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        if(await User.findOne({username: req.body.username}) == null) 
        {
            const hash = await bcrypt.hash(req.body.password, 10);
            await User.create({username: req.body.username, hashedPassword: hash});
            return res.json({message: 'User created.'});
        } else {
            return res.json({message: 'User already exists.'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(user != null) 
        {
            if(await bcrypt.compare(req.body.password, user.hashedPassword)) {
                const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
                return res.json({message: 'Login successful', token: token});
            } else {
                return res.status(401).json({message: 'Incorrect username or password.'});
            }
        } else {
            return res.status(401).json({message: `User doesn't exist.`});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

export const logoutUser = async (req, res) => {
    //client side deals with invalidating token?
    return res.json({message: 'Log Out successful.'});
}
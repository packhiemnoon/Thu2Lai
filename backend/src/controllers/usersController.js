import User from '#models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({message: 'Username and password are required.'});
        }

        // Check if user already exists
        const existingUser = await User.findOne({username});
        if (existingUser != null) {
            return res.status(409).json({message: 'User already exists.'});
        }

        // Create new user
        const hash = await bcrypt.hash(password, 10);
        await User.create({username, hashedPassword: hash});
        return res.status(201).json({message: 'User created successfully.'});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({message: 'Username and password are required.'});
        }

        // Find user
        const user = await User.findOne({username});
        if (user == null) {
            return res.status(401).json({message: 'Incorrect username or password.'});
        }

        // Verify password
        if (await bcrypt.compare(password, user.hashedPassword)) {
            const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
            return res.status(200).json({message: 'Login successful.', token});
        } else {
            return res.status(401).json({message: 'Incorrect username or password.'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}

export const logoutUser = async (req, res) => {
    return res.status(200).json({message: 'Logout successful.'});
}
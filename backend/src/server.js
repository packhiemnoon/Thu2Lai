import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import usersRoute from './routes/usersRoute.js';
import translateRoute from './routes/translateRoute.js';

import mongoose from 'mongoose';

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello');
});

app.use('/users', usersRoute);
app.use('/translate', translateRoute);

try {
    await mongoose.connect(process.env.MONGO_URL);
} catch (err){
    console.log('connection to mongodb failed');
    console.log(err.message);
    process.exit(1);
}

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})
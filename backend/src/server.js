import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from '#routes';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timeStamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.use(routes);

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('🍃 Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
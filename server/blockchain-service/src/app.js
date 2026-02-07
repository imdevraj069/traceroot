import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';

export const PORT = process.env.PORT || 3003;

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        service: "blockchain-service",
        status: "running",
        port: PORT
    });
});

// Routes
import blockchainRoutes from './routes/blockchain.routes.js';
app.use('/api/blockchain', blockchainRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

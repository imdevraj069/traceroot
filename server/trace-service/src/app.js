import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';

export const PORT = process.env.PORT || 3002;

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
        service: "trace-service",
        status: "running",
        port: PORT
    });
});

// Routes
import batchRoutes from './routes/batch.routes.js';
import publicRoutes from './routes/public.routes.js';
import certificationRoutes from './routes/certification.routes.js';

app.use('/api/batches', batchRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/certifications', certificationRoutes);

import analyticsRoutes from './routes/analytics.routes.js';
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

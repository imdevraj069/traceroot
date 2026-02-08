import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT || 3002;

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

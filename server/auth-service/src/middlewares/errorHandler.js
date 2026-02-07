import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: null
        });
    }

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors,
            data: null
        });
    }

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate field value',
            errors: [err.message],
            data: null
        });
    }

    // Default server error
    console.error('Error:', err);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: [err.message],
        data: null
    });
};

export default errorHandler;

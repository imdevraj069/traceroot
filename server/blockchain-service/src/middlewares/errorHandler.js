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

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors,
            data: null
        });
    }

    console.error('Error:', err);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: [err.message],
        data: null
    });
};

export default errorHandler;

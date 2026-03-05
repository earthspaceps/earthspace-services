const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => e.message);
        return res.status(400).json({ success: false, message: 'Validation error.', errors: messages });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ success: false, message: 'Record already exists.' });
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    // Request body too large
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'Request body too large.' });
    }

    // Default error — NEVER leak raw messages in production
    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    const message = (statusCode < 500 && err.message) ? err.message : (isProduction ? 'Internal server error.' : err.message);
    const response = { success: false, message };
    // In development only, add the stack trace for debugging
    if (!isProduction && err.stack) response.stack = err.stack;
    res.status(statusCode).json(response);
};

const notFound = (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
};

module.exports = { errorHandler, notFound };

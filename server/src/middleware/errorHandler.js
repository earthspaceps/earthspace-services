const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => e.message);
        return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ success: false, message: 'Record already exists.', errors: err.errors.map(e => e.message) });
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error.';
    res.status(statusCode).json({ success: false, message });
};

const notFound = (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
};

module.exports = { errorHandler, notFound };

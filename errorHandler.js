function errorHandler(err, req, res, next) {
    // Ensure res is the actual response object
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    })
}

export default errorHandler;

const errorMiddleware = (error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        success: false,
        error: {
            message: error.message || 'Internal Server Error'
        }
    });
}

export default errorMiddleware;
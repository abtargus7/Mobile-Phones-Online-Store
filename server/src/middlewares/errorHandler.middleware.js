import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {

    const statusCode = err instanceof ApiError ? err.statusCode : 500
    const message = err.message || "Internal Server Error";


    res.status(statusCode).json({
        success: false,
        message,
    })
} 

export default errorHandler
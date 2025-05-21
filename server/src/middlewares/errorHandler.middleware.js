import { ApiError } from "../utils/ApiError.js";

//gloabal error handling middleware
const errorHandler = (err, req, res, next) => {

    //fetch stauts code and message from error
    const statusCode = err instanceof ApiError ? err.statusCode : 500
    const message = err.message || "Internal Server Error";

    //send response with error 
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    })
} 

export default errorHandler
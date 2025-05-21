import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if(!token) throw new ApiError(401, "Unauthorized Request")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findOne({
            where: {id: decodedToken.id},
            attributes: {exclude: ["password", "accessToken"]}
        })

        if(!user) throw new ApiError(401, "Invalid access token")

        req.user = user
        next()

    } catch(error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export const isAdmin = asyncHandler( async(req, res, next) => {
    const userRole = req.user.role
    if(userRole !== "admin") throw new ApiError(401, "User not authorized")
    next() 
})

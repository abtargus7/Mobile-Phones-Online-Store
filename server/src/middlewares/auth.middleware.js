import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

//middleware to authenticate user
export const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        //check if token recieved with reqest
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        //if token not recieved throw error
        if(!token) throw new ApiError(401, "Unauthorized Request")

        //decode token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //fetch user from database 
        const user = await User.findOne({
            where: {id: decodedToken.id},
            attributes: {exclude: ["password", "accessToken"]}
        })

        //if user not found throw error
        if(!user) throw new ApiError(401, "Invalid access token")

        //attach user to request
        req.user = user

        //pass the request
        next()

    } catch(error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

//middleware to authorize admins only
export const isAdmin = asyncHandler( async(req, res, next) => {

    //get userRole from attached user from request
    const userRole = req.user.role

    //if user is not admin throw error
    if(userRole !== "admin") throw new ApiError(401, "User not authorized")

    //pass the request 
    next() 
})

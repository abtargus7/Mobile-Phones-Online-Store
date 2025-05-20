import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import User from '../models/user.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const generateAccessToken = async (userId) => {
    try {
        console.log(userId)
        const user = await User.findByPk(userId)

        if(!user) throw new ApiError(404, "User not found")
        
        const accessToken = user.generateAccessToken()

        user.accessToken = accessToken

        const updatedUser = await user.save({validate: false})

        return accessToken
    } catch (error) {
        throw new ApiError(401, "Unable to generate access token")
    }
}

const createUser = asyncHandler( async(req, res) => {
    const {email, password, role} = req.body

    if(
        [email, password].some((field) => {
            field?.trim() == ""
        })
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOrCreate({
        where: {email},
        defaults: {password, role}
    })

    console.log(existedUser[1])

    if(!existedUser[1]) throw new ApiError(409, "User already Exists")

    return res.status(201).json(new ApiResponse(201, existedUser, "User Registered Successfully"))

})

const getUser = asyncHandler( async( req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({where: {email}})
    
    if(!user) throw new ApiError(404, "User does not exist")

    const isPasswordCorrect = user.isPasswordCorrect(password)

    if(!isPasswordCorrect) throw new ApiError(401, "Invalid user credentials")

    const accessToken = await generateAccessToken(user.id)
    
    const loggedInUser = await User.findOne({
        where: {id: user.id},
        attributes: {exclude: ["password"]} //exclude password field
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200,{user: loggedInUser, accessToken}, "User Logged In successfully"))

    
})

export {createUser, getUser}
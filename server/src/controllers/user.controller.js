import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import User from '../models/user.js'
import {ApiResponse} from '../utils/ApiResponse.js'

// method to generate access token 
const generateAccessToken = async (userId) => {
    try {
        console.log(userId)

        //find user by id
        const user = await User.findByPk(userId)

        //throw error if user not found
        if(!user) throw new ApiError(404, "User not found")
        
        //generate token 
        const accessToken = user.generateAccessToken()

        //add token into user database
        user.accessToken = accessToken

        //save updated user
        await user.save({validate: false})

        //return token
        return accessToken
    } catch (error) {
        //throw error if token not created
        throw new ApiError(401, "Unable to generate access token")
    }
}

//insert user into the database - signup
const createUser = asyncHandler( async(req, res) => {
    const {email, password, role} = req.body

    //validate email and password - if not empty
    if(
        [email, password].some((field) => {
            field?.trim() == ""
        })
    ){
        throw new ApiError(400, "All fields are required")
    }

    //create user if not exists
    const existedUser = await User.findOrCreate({
        where: {email},
        defaults: {password, role}
    })

    //throw error if user already exists
    if(!existedUser[1]) throw new ApiError(409, "User already Exists")

    //send response
    return res.status(201).json(new ApiResponse(201, existedUser, "User Registered Successfully. Please login"))

})

//fetch user from database - login
const getUser = asyncHandler( async( req, res) => {
    const {email, password} = req.body

    //fetch user from database using email
    const user = await User.findOne({where: {email}})
    
    //throw error if user not found
    if(!user) throw new ApiError(404, "User does not exist")

    //match password
    const isPasswordCorrect = user.isPasswordCorrect(password)

    //throw error if password is not matched
    if(!isPasswordCorrect) throw new ApiError(401, "Invalid user credentials")

    //create token if password matches and update user with token
    const accessToken = await generateAccessToken(user.id)
    
    //fetch update user
    const loggedInUser = await User.findOne({
        where: {id: user.id},
        attributes: {exclude: ["password"]} //exclude password field
    })

    //cookie options
    const options = {
        httpOnly: true,
        secure: true
    }

    //create cookies and send in response
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200,{user: loggedInUser, accessToken}, "User Logged In successfully"))

    
})

//log out user
const logOutUser = asyncHandler( async(req, res) => {

    //delete token from user
    await User.update(
        {accessToken: null},
        {where: {id: req.user.id}}
    )

    //cookie options
    const options = {
        httpOnly: true,
        secure: true
    }

    //clear cookies and send response
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

//export user controllers
export {createUser, getUser, logOutUser}
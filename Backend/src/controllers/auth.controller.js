// import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import User from '../models/user.model.js'
import {generateAccessToken , generateRefreshToken } from '../utilities/generateToken.js'
import { asyncHandler } from "../utilities/asyncHandler.js"

//Registering a new user

const register = asyncHandler(async (req,res) =>
    {
        try {
            const {username , email, password , profession} = req.body
            console.log(req.body)
            const existingUser = await User.findOne({email: email});
            
            if(existingUser)
            {
                return res.status(400).json({message :  "User already exists"})
            }
    
            //Not required because already used pre(save) hook
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(password,salt);
    
            const newuser =  new User({
                username,
                email,
                password,
                profession
            })
            const user = await newuser.save()
            console.log(user)

            const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
            if(!createdUser)
            {
                return res.status(500).json({message :" User not Found !"})
            }
    
            return res.status(201).json({
                message : "User Registered Successfully",
                user: createdUser,
            })
    
        } catch (error) {

            return res.status(500).json({message : "Internal g Server Error",error})
        }
    })

//loging the user 
const login = async (req,res) => 
{ 
    try {
        const {email , password} = req.body
        console.log(req.body)
        const user = await User.findOne({email})
        console.log("user",user);
        
        if(!user)
        {
            throw new Error("User not Found!")
        }

        const PasswordCheck = await user.isPasswordCorrect(password)
        console.log(PasswordCheck)

        if(!PasswordCheck)
        {
            //return res.status(400).json({message : "Password is Incorrect"})
            throw new Error("Password is Incorrect")
        }

        //Access and Refresh Tokens
        const AccessToken = generateAccessToken(user)
        const RefreshToken = generateRefreshToken(user)

        res.cookie("refreshToken", RefreshToken,{
            httpOnly : true, //prevents access via js
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite : "strict", // protect against CSRF(cross-site Request forgery)
            maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        user.refreshToken = RefreshToken
        user.accessToken = AccessToken
        await user.save(
            {validateBeforeSave:true}
        );

        return res.json({accessToken:AccessToken,refreshToken:RefreshToken,user: {id : user._id , email : user.email, username : user.username}})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message || "Internal Server Error"})
    }
}
//getting the user profile

const getUserProfile = async (req , res) => {

    return res.json(req.user)
}

//use of refresh token
const refresh = async (req,res) =>
{
    const refreshToken = req.cookies.refreshToken //read the refresh Token
    if(!refreshToken)
    {
        return res.status(401).json({message : "refresh Token not Provided"})
    }

    try {

        const verify = jwt.verify(refreshToken,process.env.REFRESHTOKENSECRET)
        
        const user = await User.findById(verify.id);

        if(!user || user.refreshToken !== refreshToken)
        {
            return res.status(403).json({message : "Invaid refresh Token"})
        }

        const newaccessToken = generateAccessToken(user)

        if(!newaccessToken)
        {
            return res.status(403).json({message :"new refresh token generation failed"})
        }
        
        user.accessToken = newaccessToken;
        user.save()
        return res.json({accessToken : newaccessToken})
        
    } catch (error) {
        
        return res.status(403).json({message : "Invalid Refresh Token or Expired"})
    }
}

//logout functionality
const logout = async (req,res) =>
{
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided" });
    }

    //Remove Refresh Token form db
    const user = await User.findOne({refreshToken})

    if(user)
    {
        user.refreshToken = null;
        await user.save()
    }

    //remove the refresh Token from the cookies
    res.clearCookie("refreshToken",{httponly : true , secure : true , sameSite : "Strict"})

    return res.json({message:"Logged Out Successfully"})
}

const changeUserPassword = asyncHandler(async(req,res,next) => {
    const {oldPassword , newPassword , confirmPassword } = req.body;

    //basic validation
    if(!oldPassword)
    {
        return res.status(400).json({message: "old field is required"})
    }
    if(!newPassword)
    {
        return res.status(400).json({message: "new field is required"})
    }
    if(!confirmPassword)
    {
        return res.status(400).json({message: "confirm field is required"})
    }

    if(newPassword !== confirmPassword)
    {
        return res.status(400).json({message:"New password does not match with confirm password"})
    }

    //find user
    const user = await User.findById(req.user?._id);
    if(!user) return res.status(404).json({message:"User not found!"})
    
    //compare the old password
    console.log(oldPassword);
    const isMatch = await user.isPasswordCorrect(oldPassword);
    if(!isMatch) return res.status(400).json({message:"Old Password is incorrect"})

    //hash and update the password
    user.password = newPassword 
    // If name or email is missing in the object (for some reason), Mongoose won’t complain, because you're telling it:
    //"Don't validate the whole object right now, just save what I changed."
    await user.save({validateBeforeSave:false})

    return res.status(200).json({message : "Password Changed Successfully"})

})

const updateUserDetails = asyncHandler(async(req,res,next)=>{
    const {email,username} = req.body

    if(!email || !username) return res.status(400).json({message: "All fields are required"})

    const user  = await User.findByIdAndUpdate(
        req.user?._id,
        {$set:{
            username,email
        }},
        {new:true}
    ).select("-password")

    return res.status(200).json({message : "All fields got updated"})
}) 

// const updateUserAvatar = asyncHandler(async(req,res) => {
//     req.files
// })


export {register , login , refresh , logout , getUserProfile,updateUserDetails,changeUserPassword}
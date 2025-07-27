import jwt from "jsonwebtoken"

const generateAccessToken = (user) => 
{
    return jwt.sign({email: user.email,id : user._id},process.env.ACCESSTOKENSECRET,{expiresIn:process.env.ACCESSTOKENEXPIRY})
}

const generateRefreshToken = (user) => 
{
    return jwt.sign({id : user._id},process.env.REFRESHTOKENSECRET,{expiresIn:process.env.REFRESHTOKENEXPIRY})
}

export {generateAccessToken , generateRefreshToken }


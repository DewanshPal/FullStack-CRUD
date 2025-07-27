import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim :  true
    },
    email : {
        type : String,
        required : true,
        unique :  true,
        trim : true,
        lowercase : true,
        index : true
    },
    password : {
        type: String,
        required : [true,"password is required"],
        trim : true,
    },
    profession:
    {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    refreshToken:
    {
        type : String
    },
    accessToken:
    {
        type : String
    }
},{ timestamps : true});

// Prevents double hashing when updating non-password fields.
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();
    console.log(this)
    this.password = await bcrypt.hash(this.password, 10);

    //Calls the next middleware or saves the document.
    next();
});

//password validation without exposing the password 
userSchema.methods.isPasswordCorrect = async function(password)
{
    try
    {
        console.log('this',this);
        console.log('password from frontend', password);
        return await bcrypt.compare(password,this.password)
    } catch (err){
        console.error('Bcrypt error:', err.message);
    }
}

const User = mongoose.model("User",userSchema);

export default User
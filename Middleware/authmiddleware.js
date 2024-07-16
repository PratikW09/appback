import  User  from "../Models/usermodels.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async(req,res,next)=>{
    try {
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new Error(401,"Unauthorized request")
        }
        // console.log("hi am ");
        const decodedToken = await jwt.verify(token,'access_token_secret');
        // console.log(decodedToken)
        const user = await User.findById(decodedToken?.userId).select(
            "-password -refreshToken"
        )
        // console.log(user)
        if(!user){
            throw new Error(401,"Invalid Access Token")
    
        }
    
        req.user = user;
        next();
    } catch (error) {

        res.status(405).json({ message: error.message || 'Invalid Access Token' });
    }
    
}
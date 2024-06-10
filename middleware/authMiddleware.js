import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

// proctected route token base
export const LoginMiddleware = async(req,res,next) => {
     try {
        const decode = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user = decode;
        next()
     } catch (error) {
        console.log(error);
     }
}


//admin middleware
export const isAdmin = async(req,res,next) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if(user.role !== 1){
           return res.status(401).send({
            success:false,
            message:"Unauthorized Access"
           })
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:"Error in admin middleware",
            error
        })
    }
}
import express, {Request,Response} from "express";
import {body} from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, errorRequest } from "@tv_best/common";
import { User } from "../models/user";

const router=express.Router();

router.post("/api/users/signup",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({min:4,max:20}).withMessage("Password should be between 4 and 20 characters")
    ],
    errorRequest,
    async(req:Request,res:Response)=>{
     const {email,password}=req.body;
        const existingUser=await User.findOne({email})

        if(existingUser){
            throw new BadRequestError("Requested mail is already defined");
        }

        const user=User.build({email,password});
        await user.save();
        
        const userJwt=jwt.sign({
            id:user.id,
            email:user.email
        }, process.env.JWT_KEY!);

        req.session={
            jwt:userJwt
        }
        res.status(201).send(user);
})

export {router as signupUserRouter};
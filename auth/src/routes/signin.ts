import express,{Request,Response} from "express";
import {body} from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, errorRequest } from "@tv_best/common";
import { User } from "../models/user";
import { Password } from "../services/password";

const router=express.Router();

router.post("/api/users/signin",
[
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").trim().isLength({min:4,max:20}).withMessage("Invalid Password")
],
errorRequest
,async (req:Request,res:Response)=>{
    
    const {email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(!existingUser){
        throw new BadRequestError("Invalid Credentials!");
    }

    const samePass=await Password.toCompare(existingUser.password,password);
    if(!samePass){
        throw new BadRequestError("Invalid Credentials!");
    }

    const userJwt=jwt.sign({
        id:existingUser.id,
        email:existingUser.email},process.env.JWT_KEY!);

    req.session={
        jwt:userJwt
    }

    res.status(200).send(existingUser);
})

export {router as signinRouter};
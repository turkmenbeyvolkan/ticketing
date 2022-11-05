import express, { Request,Response,NextFunction } from "express";
require("express-async-errors");
import {json} from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { BadRequestError, errorHandler } from "@tv_best/common";
import { signupUserRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";


const app=express();
app.set("trust proxy",true);
app.use(json());
app.use(cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !=="test"
}))

app.use(currentUserRouter);
app.use(signupUserRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("/*",(req:Request,res:Response,next:NextFunction)=>{
    throw new BadRequestError("Requested Page Not Applicable");
})

app.use(errorHandler);

export {app};
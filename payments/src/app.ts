import express,{Request,Response,NextFunction} from "express";
import {NotFoundError, currentUserHandler, errorHandler} from "@tv_best/common"
require("express-async-errors");
import {json} from "body-parser";
import cookieSession from "cookie-session";
import { newPaymentRouter } from "./routes/new";

const app=express();
app.set("trust proxy",true);
app.use(json());
app.use(cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !=="test"
}))
app.use(currentUserHandler);
app.use(newPaymentRouter);


app.all("/*",(req:Request,res:Response,next:NextFunction)=>{
    throw new NotFoundError();
})
app.use(errorHandler);

export {app};
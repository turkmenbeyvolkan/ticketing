import express,{Request,Response,NextFunction} from "express";
import {NotFoundError, currentUserHandler, errorHandler} from "@tv_best/common"
require("express-async-errors");
import {json} from "body-parser";
import cookieSession from "cookie-session";
import { createOrderRouter } from "./routes/new";
import { indexAllOrderRouter } from "./routes/index";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";


const app=express();
app.set("trust proxy",true);
app.use(json());
app.use(cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !=="test"
}))
app.use(currentUserHandler);
app.use(createOrderRouter);
app.use(indexAllOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all("/*",(req:Request,res:Response,next:NextFunction)=>{
    throw new NotFoundError();
})
app.use(errorHandler);

export {app};
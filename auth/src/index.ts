import mongoose from "mongoose";
import { DatabaseConnectionError } from "@tv_best/common";

import {app} from "./app";

const start=()=>{
    console.log("pull request ex")
    if(!process.env.JWT_KEY){
        throw new Error("You must define JWT KEY")
    }
    try {
        mongoose.connect("mongodb://auth-mongo-srv:27017/auth",{});
        console.log("Connected to Auth Serv,ce Database");
        app.listen(5001,()=>{
            console.log("App started at port: 5001");
        })
    } catch (error) {
        throw new DatabaseConnectionError();
    }
    
}

start();
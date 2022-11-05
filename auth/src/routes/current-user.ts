import express,{Request,Response} from "express";
import { currentUserHandler } from "@tv_best/common";


const router=express.Router();

router.get("/api/users/currentuser",
    currentUserHandler,
    (req:Request,res:Response)=>{
        
        res.status(200).send({currentUser:req.currentUser || null});
    })

export {router as currentUserRouter};
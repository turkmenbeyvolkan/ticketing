import express ,{Request,Response} from "express";
import {Order} from "../models/order";
import { NotFoundError, requireAuth } from "@tv_best/common";

const router=express.Router();

router.get("/api/orders",requireAuth,async (req:Request, res:Response)=>{
    const order=await Order.find({userId:req.currentUser!.id}).populate("ticket").sort({expiresAt:-1});
    if(!order){
        throw new NotFoundError();
    }

    res.status(201).send(order);
})

export {router as indexAllOrderRouter}
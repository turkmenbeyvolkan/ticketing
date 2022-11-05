import express, {Request,Response} from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@tv_best/common";
import { Order } from "../models/order";

const router=express.Router();

router.get("/api/orders/:id",requireAuth,async(req:Request, res:Response)=>{

    const id=req.params.id;
    const userId=req.currentUser!.id;

    const existingOrder=await Order.findById(id).populate("ticket");
    if(!existingOrder){
        throw new NotFoundError();
    }
    if(existingOrder.userId!==userId){
        throw new NotAuthorizedError();
    }

    res.status(201).send(existingOrder);

})

export {router as showOrderRouter}
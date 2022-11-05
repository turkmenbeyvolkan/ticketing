import express, {Request, Response} from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@tv_best/common";
import {Order, OrderStatus} from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsClient } from "../nats-wrapper";


const router=express.Router();

router.delete("/api/orders/:id",requireAuth,async(req:Request,res:Response)=>{
    const id=req.params.id;
    const userId=req.currentUser!.id;

    const order=await Order.findById(id).populate("ticket");
    if(!order){
        throw new NotFoundError();
    }
    if(userId!==order.userId){
        throw new NotAuthorizedError();
    }

    order.set({status:OrderStatus.Cancelled});
    await order.save();
    await new OrderCancelledPublisher(natsClient.client).publish({
        id:order.id,
        version:order.version,
        ticket:{
            id:order.ticket.id
        }
    })
    res.status(204).send(order);

})

export {router as deleteOrderRouter}
import express, { Request,Response} from "express";
import {body} from "express-validator";
import { Ticket } from "../models/ticket";
import { Order,OrderStatus } from "../models/order";
import { requireAuth,errorRequest,NotFoundError, BadRequestError} from "@tv_best/common";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsClient } from "../nats-wrapper";


const router=express.Router();

router.post("/api/orders",requireAuth,[
    body("ticketId").notEmpty().withMessage("You need to supply a ticket")
],
errorRequest, 
async (req:Request,res:Response)=>{
    const {ticketId}=req.body;
    const userId=req.currentUser!.id;
    const USER_WINDOW_EXPIRATIN_TIME=1*60;
    const ticket=await Ticket.findById(ticketId);
    if(!ticket){
        throw new NotFoundError();
    }
    const existingOrder=await Order.findOne({
        ticket,
        status:{
                $in:[
                        OrderStatus.Created,
                        OrderStatus.AwaitingPayment,
                        OrderStatus.Completed
                    ]
                }
            });
    if(existingOrder){
        throw new BadRequestError("Ticket is already reserved!")
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds()+USER_WINDOW_EXPIRATIN_TIME);
    const order=Order.build({
        userId,
        status:OrderStatus.Created,
        expiresAt:expiration,
        ticket:ticket
    });
    await order.save();
    await new OrderCreatedPublisher(natsClient.client).publish({
        id:order.id,
        status:order.status,
        userId:order.userId,
        expiresAt:order.expiresAt.toISOString(),
        version:order.version,
        ticket:{
            id:order.ticket.id,
            price:order.ticket.price
        }
    })
    res.status(201).send(order);

})

export {router as createOrderRouter}
import express, {Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import {NotFoundError, errorRequest,requireAuth, NotAuthorizedError, BadRequestError} from "@tv_best/common";

import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import {natsClient} from "../nats-wrapper";

const router=express.Router();

router.put("/api/tickets/:id",
requireAuth,
[body("title").notEmpty().withMessage("You must supply a title"),
body("price").isFloat({gt:0}).withMessage("You must enter prive greater than 0")],
errorRequest,
async(req:Request, res:Response,next:NextFunction)=>{
    const {title,price}=req.body;
    const id = req.params.id;
    
    const ticket = await Ticket.findById(id);
    if(!ticket){
        throw new NotFoundError();
    }
    if(ticket.orderId){
        throw new BadRequestError("The ticket already reserved!");
    }
    if(ticket.userId!==req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    ticket.set({title,price})
    await ticket.save();
    await new TicketUpdatedPublisher(natsClient.client).publish({
        id:ticket.id,
        title:ticket.title,
        price:ticket.price,
        userId:ticket.userId,
        version:ticket.version
    })
    res.send(ticket);
})

export {router as updateTicketRouter}
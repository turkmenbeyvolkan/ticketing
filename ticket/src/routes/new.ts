import express, { Request, Response, NextFunction} from "express";
import {body} from "express-validator"
import {errorRequest, requireAuth} from "@tv_best/common";
import { natsClient } from "../nats-wrapper";

import {Ticket} from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const router=express.Router();

router.post("/api/tickets",
requireAuth,
[
    body("title").notEmpty().withMessage("Invalid Title"),
    body("price").isFloat({gt:0}).withMessage("Price should be greater than 0")
],
errorRequest,
async (req:Request,res:Response,next:NextFunction)=>{

    const {title, price}=req.body;
    const userId=req.currentUser!.id;


    const ticket=Ticket.build({title, price, userId});
    await ticket.save();
    await new  TicketCreatedPublisher(natsClient.client).publish({
        id:ticket.id,
        title:ticket.title,
        price:ticket.price,
        userId:ticket.userId,
        version:ticket.version
    });
    res.status(200).send(ticket);
})

export {router as createTicketRouter};
import express, {Request, Response, NextFunction} from "express";
import {Ticket} from "../models/ticket";

const router=express.Router();

router.get("/api/tickets",async(req:Request,res:Response,next:NextFunction)=>{
    const tickets=await Ticket.find({orderId:undefined});

    res.status(201).send(tickets);
})

export {router as indexAllTicketsRouter}
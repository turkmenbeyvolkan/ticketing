import express,{Request,Response,NextFunction} from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@tv_best/common";

const router=express.Router();

router.get("/api/tickets/:id",async(req:Request,res:Response,next:NextFunction)=>{

    const id=req.params.id;

    const ticket=await Ticket.findById(id);
    if(!ticket){
        throw new NotFoundError();
    }
    res.status(201).send(ticket);
})

export {router as showTicketRouter};
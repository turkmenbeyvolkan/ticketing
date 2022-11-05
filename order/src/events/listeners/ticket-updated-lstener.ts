import { Listener, TicketUpdatedEvent, Subjects,NotFoundError } from "@tv_best/common";
import {Message} from "node-nats-streaming"
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
    queueGroupName="order-service";
    async onMessage(data:TicketUpdatedEvent["data"],msg:Message){
        const {id,title,price,version}=data;

        const ticket= await Ticket.findOne({_id:id,version:version-1});
        if(!ticket){
            throw new NotFoundError();
        }
        // console.log("data:",data)
        // console.log("ticket:",ticket);
        ticket.set({title,price});
        await ticket.save();

        msg.ack();
    }
}
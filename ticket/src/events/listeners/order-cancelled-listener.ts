import { Listener,NotFoundError,OrderCancelledEvent, Subjects } from "@tv_best/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject:Subjects.OrderCancelled=Subjects.OrderCancelled;
    queueGroupName="ticket-service";

    async onMessage(data:OrderCancelledEvent["data"],msg:Message){
        const ticketId=data.ticket.id;
        const ticket=await Ticket.findById(ticketId);
        if(!ticket){
            throw new NotFoundError();
        }

        try{
        ticket.set({orderId:undefined});
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version
        })
        msg.ack();
    }
    catch(error){
        console.error();
    }
    }
}
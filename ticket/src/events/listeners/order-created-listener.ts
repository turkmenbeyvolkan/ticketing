import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from "@tv_best/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject:Subjects.OrderCreated=Subjects.OrderCreated;
    queueGroupName="ticket-service";

    async onMessage(data:OrderCreatedEvent["data"],msg:Message){
        const ticketId=data.ticket.id;
        const ticket=await Ticket.findById(ticketId);
        if(!ticket){
            throw new NotFoundError();
        }

        ticket.set({orderId:data.id});
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version,
        })
        msg.ack();
    }
}
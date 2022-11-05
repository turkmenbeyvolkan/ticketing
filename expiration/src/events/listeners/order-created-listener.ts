import { Listener, OrderCreatedEvent, Subjects } from "@tv_best/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject:Subjects.OrderCreated=Subjects.OrderCreated;
    queueGroupName="expiration-service";
    
    async onMessage(data:OrderCreatedEvent["data"],msg:Message){
        const orderId=data.id;
        const delay=new Date(data.expiresAt).getTime()-new Date().getTime();
        expirationQueue.add("data",{orderId},{
            delay
        });

        msg.ack();
    }
}
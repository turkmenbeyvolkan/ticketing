import {Subjects, ExpirationCompletedEvent,Listener, NotFoundError} from "@tv_best/common";
import { Message } from "node-nats-streaming";
import { Order,OrderStatus } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent>{
    subject:Subjects.ExpirationCompleted=Subjects.ExpirationCompleted;
    queueGroupName="order-service";
    async onMessage(data:ExpirationCompletedEvent["data"],msg:Message){
        const id=data.orderId;
        const order=await Order.findById(id).populate("ticket");
        if(!order){
            throw new NotFoundError();
        }
        if(order.status===OrderStatus.Completed){
            return msg.ack();
        }
        order.set({status:OrderStatus.Cancelled});
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id:order.id,
            version:order.version,
            ticket:{
                id:order.ticket.id
            }
        })

        msg.ack();
    }
}
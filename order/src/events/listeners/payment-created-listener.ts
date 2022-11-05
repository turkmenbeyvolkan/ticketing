
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";
import { Listener, NotFoundError, PaymentCreatedEvent, Subjects } from "@tv_best/common";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = "order-service";

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const { orderId } = data;
        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError();
        }
        order.set({
            status: OrderStatus.Completed
        });
        await order.save();
        msg.ack();
    }
}
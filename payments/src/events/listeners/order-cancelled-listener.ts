import { Listener, Subjects, OrderCancelledEvent, NotFoundError } from "@tv_best/common"
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";

class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = "payments-service";
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findOne({ _id: data.id, version: data.version - 1 });
        if (!order) {
            throw new NotFoundError();
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();

    }
}

export { OrderCancelledListener }
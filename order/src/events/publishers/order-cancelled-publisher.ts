import {Publisher, OrderCancelledEvent,Subjects} from "@tv_best/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject:Subjects.OrderCancelled=Subjects.OrderCancelled;
}
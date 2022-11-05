import {Publisher, OrderCreatedEvent,Subjects} from "@tv_best/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject:Subjects.OrderCreated=Subjects.OrderCreated;
}
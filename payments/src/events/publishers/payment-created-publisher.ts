import { Publisher,Subjects,PaymentCreatedEvent } from "@tv_best/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
        subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
        
}
import { Publisher, Subjects, TicketUpdatedEvent } from "@tv_best/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
        subject:Subjects.TicketUpdated=Subjects.TicketUpdated;
}
import { Publisher, Subjects, TicketCreatedEvent } from "@tv_best/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
        subject:Subjects.TicketCreated=Subjects.TicketCreated;
}
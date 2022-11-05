import { Publisher,Subjects,ExpirationCompletedEvent} from "@tv_best/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{
    subject: Subjects.ExpirationCompleted=Subjects.ExpirationCompleted;
    
    
}
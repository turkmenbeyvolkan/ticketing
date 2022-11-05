import {Queue, Worker, Job,QueueScheduler} from "bullmq";
import {ExpirationCompletedPublisher} from "../events/publishers/expiration-completed";
import { natsClient } from "../nats-wrapper";

interface Payload{
    orderId:string;
}
const expirationQueueScheduler = new QueueScheduler('order:expiration',{
    connection:{
        host:process.env.REDIS_HOST
    }
});

const expirationQueue=new Queue<Payload>("order:expiration",{
    connection:{
        host:process.env.REDIS_HOST
    }
})

const worker=new Worker("order:expiration", async(job:Job)=>{
    console.log(job.data.orderId);
    await new ExpirationCompletedPublisher(natsClient.client).publish({orderId:job.data.orderId});
},{connection:{
    host:process.env.REDIS_HOST
}})  

export{expirationQueue};
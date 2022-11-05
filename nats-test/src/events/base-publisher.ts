import {Stan} from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event{
    subject:Subjects.TicketCreated,
    data:{
        id:string;
        title:string;
        price:number;
    }
}

export abstract class Publisher<T extends Event>{
    private client:Stan;
    abstract subject:T["subject"];
   

    constructor(client:Stan){
        this.client=client;
    }

    publish(data:T["data"]):Promise<void>{

        return new Promise((resolve,reject)=>{
            const stringData=this.toJSON(data);
            this.client.publish(this.subject,stringData,(err)=>{
                if(err){
                    return reject(err);
                }
                console.log(`Event published : ${this.subject}`,data);
                resolve();
            });
        })
        
    }

    toJSON(data:any){
        return JSON.stringify(data);
    }
}
import nats ,{Stan} from "node-nats-streaming";
import { BadRequestError } from "@tv_best/common";

class NatsWarapper{
     private _client?:Stan;

     get client(){
        if(!this._client){
            throw new BadRequestError("Cannot acess NATS client before connecting");
        }
        return this._client;
     }

     connect(clusterId:string,clientId:string, url:string){
        this._client=nats.connect(clusterId,clientId,{
            url:url
        })
        return new Promise<void>((resolve,reject)=>{
            this.client.on("connect",()=>{
                console.log("Connected to Nats");
                resolve();
            })

            this.client.on("error",(err)=>{
                reject(err);
            })
            
        })
     }
}

const natsClient=new NatsWarapper();

export {natsClient};
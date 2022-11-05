import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsClient } from "./nats-wrapper";

const start=async()=>{

    if(!process.env.NATS_URI){
        throw new Error("You must define NATS_URI")
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error("You must define NATS_CLUSTER_ID")
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error("You must define NATS_CLIENT_ID")
    }
    try {
        await natsClient.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URI);
        natsClient.client.on("close",()=>{
            console.log("NATS is closing");
            process.exit();
        })
        process.on("SIGINT",()=>{natsClient.client.close()});
        process.on("SIGTERM",()=>{natsClient.client.close()});
        
        await new OrderCreatedListener(natsClient.client).listen();
        
    } catch (error) {
      
    }
    
}

start();
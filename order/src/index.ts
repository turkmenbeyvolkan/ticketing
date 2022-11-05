import mongoose from "mongoose";
import { natsClient } from "./nats-wrapper";
import { DatabaseConnectionError } from "@tv_best/common";

import {app} from "./app";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-lstener";
import { ExpirationCompletedListener } from "./events/listeners/expiration-completed-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start=async()=>{
    if(!process.env.JWT_KEY){
        throw new Error("You must define JWT KEY")
    }
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
        new TicketCreatedListener(natsClient.client).listen();
        new TicketUpdatedListener(natsClient.client).listen();
        new ExpirationCompletedListener(natsClient.client).listen();
        new PaymentCreatedListener(natsClient.client).listen();    
        mongoose.connect("mongodb://order-mongo-srv:27017/order",{});
        console.log("Connected to Order Service Database");
        app.listen(5003,()=>{
            console.log("App started at port: 5003");
        })
    } catch (error) {
        throw new DatabaseConnectionError();
    }
    
}

start();
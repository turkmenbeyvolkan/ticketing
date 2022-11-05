import mongoose from "mongoose";
import {randomBytes} from "crypto";
import { natsClient } from "./nats-wrapper";
import { DatabaseConnectionError } from "@tv_best/common";

import {app} from "./app";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

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
        new OrderCreatedListener(natsClient.client).listen();
        new OrderCancelledListener(natsClient.client).listen();    
        mongoose.connect("mongodb://ticket-mongo-srv:27017/ticket",{});
        console.log("Connected to Ticket Service Database");
        app.listen(5002,()=>{
            console.log("App started at port: 5001");
        })
    } catch (error) {
        throw new DatabaseConnectionError();
    }
    
}

start();
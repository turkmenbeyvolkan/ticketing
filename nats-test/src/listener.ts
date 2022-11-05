import nats from "node-nats-streaming";
import {randomBytes} from "crypto"
import { TicketCreatedListener } from "./events/ticket-created-listener";
import { TicketUpdatedListener } from "./events/ticket-updated-listener";

const stan=nats.connect("microbest",randomBytes(4).toString("hex"),{
    url:"http://localhost:4222"
});

stan.on("connect",()=>{
    console.log("Listener connected to NATS");

    stan.on("close",()=>{
        console.log("NATS is closing");
        process.exit();
    })
    new TicketCreatedListener(stan).listen();
    new TicketUpdatedListener(stan).listen();
})

process.on("SIGINT",()=>{stan.close()});
process.on("SIGTERM",()=>{stan.close()});    
   




import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan=nats.connect("microbest","akak",{
    url:"http://localhost:4222"
});

stan.on("connect",async ()=>{
    console.log("Publisher connected NATS");

    const publisher=new TicketCreatedPublisher(stan);
    await publisher.publish({
        id:"123",
        title:"New Concert Ticket",
        price:20
    })
    
})


import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";


it("it returns invalid request route",async()=>{
    const response=await request(app)
        .post("/api/tickets")
        .send({})
    
    expect(response.statusCode).not.toEqual(404);
});

it("can be accessed if the user signed in",async()=>{
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(400)
})

it("returns a status other than 401",async ()=>{
    const response = await request(app)
                            .post("/api/tickets")
                            .set("Cookie",global.signin())
                            .send({})
    
    expect(response.status).not.toEqual(400);
})

it("returns invalid title if an invalid title provided", async ()=>{
    await request(app)
            .post("/api/tickets")
            .set("Cookie",global.signin())
            .send({
                price:10
            })
            .expect(401);
        
        await request(app)
        .post("/api/tickets")
        .set("Cookie",global.signin())
        .send({
            title:"title"
        })
        .expect(401);
    }
)
it("creates a ticket if valid inputs supplied", async ()=>{
    let tickets=await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
            .post("/api/tickets")
            .set("Cookie",global.signin())
            .send({
                title:"Ticket Title",
                price:10
            })
            .expect(200);
            
    tickets=await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual("Ticket Title");
    expect(tickets[0].price).toEqual(10);
    }
)
import request from "supertest";
import {app} from "../../app";

const createTicket=(title:string,price:number)=>{
return  request(app)
        .post("/api/tickets")
        .set("Cookie",global.signin())
        .send({
           title,price
        })
};

it("can fetch list of all tickets",async()=>{
    await createTicket("ticket1",10);
    await createTicket("ticket2",20);
    await createTicket("ticket3",30);

    const response=await request(app)
            .get("/api/tickets")
            .set("Cookie",global.signin())
            .send({})
            .expect(201)
    expect(response.body.length).toEqual(3);
})
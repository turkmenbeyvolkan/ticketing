import request from "supertest";
import mongoose from "mongoose";
import {app} from "../../app";

it("returns not founds error with status 404",async () => {
    const id=new mongoose.Types.ObjectId().toHexString();
    await request(app)
            .get(`/api/tickets/${id}`)
            .send()
            .expect(404)
})

it("returns the ticket if the ticket is found with status 201",async()=>{
    const title="Ticket Created";
    const price=20;
    const response=await request(app)
                            .post("/api/tickets")
                            .set("Cookie",global.signin())
                            .send({title,price})
                            expect(201)
   
    const ticketResponse=await request(app)
                                .get(`/api/tickets/${response.body.id}`)
                                .send()
                                .expect(201);
})
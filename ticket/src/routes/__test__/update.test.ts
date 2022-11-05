import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";


it("returns with status 404 if the user is not signed",async()=>{
    const id=new mongoose.Types.ObjectId().toHexString();

    await request(app)
            .put(`/api/tickets/${id}`)
            .send({   
                title:"asdfg",
                price:20})
            .expect(400)
})

it("returns with status 404 if the invalid values supllied",async()=>{
    const id=new mongoose.Types.ObjectId().toHexString();

    await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie",global.signin())
            .send({
                title:"asdfg",
                price:20
            })
            .expect(404)
})
it("returns with status 400 if the user is not authorized",async()=>{
    
    const response=await request(app)
                            .post("/api/tickets")
                            .set("Cookie",global.signin())
                            .send({
                                title:"ticket",
                                price:10
                            })
    const updated=await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set("Cookie",global.signin())
                .send({
                    title:"asdfg",
                    price:20
                })
                .expect(400)
                
    
})
it("returns with success",async()=>{
    const cookie=global.signin();
    const response=await request(app)
                            .post("/api/tickets")
                            .set("Cookie",cookie)
                            .send({
                                title:"ticket",
                                price:10
                            })
    const updated=await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set("Cookie",cookie)
                .send({
                    title:"asdfg",
                    price:20
                })
                .expect(200)
                
    
})
it("returns with 401 if invalid inputs supplied",async()=>{
    const cookie=global.signin();
    const response=await request(app)
                            .post("/api/tickets")
                            .set("Cookie",cookie)
                            .send({
                                title:"ticket",
                                price:10
                            })
    const updated=await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set("Cookie",cookie)
                .send({
                    price:20
                })
                .expect(401)
                
    
})
it("returns with 401 if invalid inputs supplied",async()=>{
    const cookie=global.signin();
    const response=await request(app)
                            .post("/api/tickets")
                            .set("Cookie",cookie)
                            .send({
                                title:"ticket",
                                price:10
                            })
    const updated=await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set("Cookie",cookie)
                .send({
                    title:"changedTicket"
                })
                .expect(401)
                
    
})
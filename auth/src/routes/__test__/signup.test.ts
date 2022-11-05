import request from "supertest";
import { app } from "../../app";

it("it return a succesfull signup",async () => {
    request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"12345"
        })
        .expect(201);
})

it("it should return an error with invalid credentials",async()=>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"123"
        })
        .expect(401)
    
        await request(app)
        .post("/api/users/signup")
        .send({
            email:"testasdfg",
            password:"1234"
        })
        .expect(401)
})

it("it should return a cookie",async()=>{
    const response=await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"1234"})
        
    const cookie=response.headers["set-cookie"];
    expect(cookie).not.toBeNull()
})
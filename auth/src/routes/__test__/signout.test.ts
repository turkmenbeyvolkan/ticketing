import request from "supertest";
import { app } from "../../app";

it("it return a succesfull signout",async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"12345"
        })
        .expect(201);

    const response=await request(app)
        .post("/api/users/signout")
        .expect(400)
        
        expect(response.body).toEqual({});
})
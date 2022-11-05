import request from "supertest";
import { app } from "../../app";

it("it return a succesfull signup currentuser",async () => {
    const res1=await request(app)
        .post("/api/users/signup")
        .send({
            email:"test@test.com",
            password:"12345"
        })
        .expect(201);

        const cookie=res1.get("Set-Cookie")

    const response=await request(app)
        .get("/api/users/currentuser")
        .set("Cookie",cookie)
        .expect(200)
       
        expect(response.body.currentUser).not.toBeNull();
        expect(response.body.currentUser.email).toEqual("test@test.com")

        
})
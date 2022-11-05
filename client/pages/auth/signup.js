import { useState } from "react";
import Router from "next/router";
import {Segment,Form, Button, Container, Grid} from "semantic-ui-react";
import  useRequest  from "../hooks/use-request";

const Signup=()=>{

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const {doRequest,errors}=useRequest({
        url:"/api/users/signup",
        method:"post",
        body:{
            email:email,
            password:password
        },
        onSuccess:()=>Router.push("/")
    })
    let handleSubmit=async(event)=>{
            event.preventDefault();
            await doRequest();
    }

    return  <Container>
        
            <Grid padded centered>
                <Grid.Column width={8}>
                <Segment raised style={{marginTop:"5%"}}>
                <Form onSubmit={handleSubmit} 
                    size="small">
                    <h1>Sign Up</h1>
                <Form.Field>
                    <label>Email</label>
                    <input placeholder='Example@Example.com' onChange={(e)=>{setEmail(e.target.value)}} />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type={"password"} placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                    {errors?errors:null}
                </Form.Field>
                    <Button type='submit' primary>Submit</Button>
                </Form>
                </Segment>
            </Grid.Column>
            
            </Grid>
       
            </Container>
}

export default Signup;
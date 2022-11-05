import { useState } from "react";
import { Form, Input, Label, Button } from "semantic-ui-react";
import useRequest from "../hooks/use-request"
import Router from "next/router";

const NewTicket = () => {
    const [title,setTitle]=useState("");
    const [price,setPrice]=useState("");
    const {doRequest,errors}=useRequest({url:"/api/tickets",method:"post",body:{title,price},onSuccess:(response)=>{Router.push("/")}});
  return (
    <div>
      <Form onSubmit={async(e)=>{
            await doRequest();
      }}>
        <Form.Field>
          <Form.Input onChange={(e)=>{setTitle(e.target.value)}} label="Title" />
        </Form.Field>
        <Form.Field>
          <Form.Input onChange={(e)=>{setPrice(e.target.value)}} label="Price" />
        </Form.Field>
        {errors}
        <Button primary type="submit">Submit</Button>
        
      </Form>
    </div>
  );
};

export default NewTicket;

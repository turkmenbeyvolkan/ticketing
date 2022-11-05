import  Router  from "next/router";
import { Button } from "semantic-ui-react";
import useRequest from "../hooks/use-request";

const TicketShow=({data})=>{
    const {doRequest,errors}=useRequest({url:"/api/orders",method:"post",body:{ticketId:data.id},onSuccess:(order)=>{Router.push("/orders/[orderId]",`/orders/${order.id}`);console.log(order)}})
    return(<div>
        <h1>{data.title}</h1>
        <h4>Price:{data.price}</h4>
        {errors}
        <Button onClick={()=>doRequest()} primary>Purchase</Button>
        </div>)
}

TicketShow.getInitialProps=async(context,client)=>{
    const {ticketId}=context.query;
    const {data}=await client.get(`api/tickets/${ticketId}`)
    
    return {
        data
    }
}

export default TicketShow;
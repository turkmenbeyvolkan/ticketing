import  Router  from "next/router"
import { Button, Table } from "semantic-ui-react"
const Orders=({orders,currentUser})=>{
    return <Table> 
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        Ticket
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Price
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Order Status
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Link
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                
                {
                orders.map((order)=>{
                    return <Table.Row><Table.Cell>{order.ticket.title}</Table.Cell><Table.Cell>{order.ticket.price}</Table.Cell><Table.Cell>{order.status}</Table.Cell><Table.Cell>{order.status==="created"?<Button onClick={()=>{Router.push("/orders/[orderId]",`/orders/${order.id}`)}}>Pay</Button>:null}</Table.Cell></Table.Row>
                })}
        
    </Table.Body>
    </Table>
}

Orders.getInitialProps=async(context,client,currentUser)=>{
    const response=await client.get("/api/orders");

    return {
        orders:response.data,
        currentUser
    }
}

export default Orders;
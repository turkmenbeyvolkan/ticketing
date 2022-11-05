import { Table } from "semantic-ui-react";
import Link from "next/link";

const Index = ({ data, currentUser }) => {
  console.log(data);
  console.log(currentUser);
  return (
    <div>
      <Table structured color="red" size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Link</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((ticket) => {
            return (
              <Table.Row key={ticket.id}>
                <Table.Cell>{ticket.title}</Table.Cell>
                <Table.Cell>{ticket.price}</Table.Cell>
                <Table.Cell>
                  <Link
                    href={"/tickets/[ticketId]"}
                    as={`/tickets/${ticket.id}`}
                  >
                    <a>View</a>
                  </Link>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

Index.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { data, currentUser };
};

export default Index;

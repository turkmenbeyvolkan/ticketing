import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../hooks/use-request";
import  Router  from "next/router";
import { Loader } from "semantic-ui-react";

const OrderShow = ({ data,currentUser }) => {
  console.log(data);
  const [timeLeft, setTimeLeft] = useState(0);
  const [succes,setSuccess]=useState("false")
  const {doRequest,errors} = useRequest({
    url:"/api/payments",
    method:"post",
    body:{orderId:data.id},
    onSuccess:()=>{setSuccess(true); Router.push("/")}
  })
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(data.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [data]);

  return (
    <div>
      {timeLeft < 0
        ? `Order is expired`
        : `You have ${timeLeft} seconds to pay for the Ticket`}
        {timeLeft<0?null:<StripeCheckout
        token={(token) => {
          doRequest({token:token.id});
        console.log(token);
        }}
        email={currentUser.email}
        amount={data.ticket.price*100}
        currency="USD"
        stripeKey="pk_test_51I1u1gB63TEUICFkG3f2mYD0ohOHdzkDK6Z50enRjxKra0al6mVLPRhM7QUdP3tBdemdTzp0yH0comYH3Wo5h8Q800DS1Y9xjz"
    />}
    
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    data,
  };
};

export default OrderShow;

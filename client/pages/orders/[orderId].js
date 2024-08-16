import useRequest from '@/hooks/useRequest';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'POST',
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push('/orders');
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft((msLeft / 1000).toFixed(0));
    };
    findTimeLeft();

    const interval = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (timeLeft < 0) return <div>Order expired</div>;

  return (
    <div>
      {timeLeft} seconds untill order expires
      <StripeCheckout
        token={token => doRequest({ token: token.id })}
        stripeKey="pk_test_51PnB1m01PKqw9sFduiRizzRcmiWtw8vnxT3AqNN4XpGmePsq5zY9WJOcBzkygZ4OTgJMpMkIURHp5DLOt5WibsVA00tIinMfW0"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const response = await client.get(`/api/orders/${orderId}`);
  console.log({ response });

  return {
    order: response.data,
  };
};

export default OrderShow;

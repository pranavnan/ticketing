const OrderIndex = ({ orders }) => {
  console.log({ orders });
  return (
    <ul>
      {orders.map(order => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const response = await client.get('/api/orders');
  // console.log({ response });

  return {
    orders: response.data,
  };
};

export default OrderIndex;

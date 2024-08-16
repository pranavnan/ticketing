import useRequest from '@/hooks/useRequest';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    body: {
      ticketId: ticket.id,
    },
    method: 'POST',
    url: '/api/orders',
    onSuccess: order => {
      console.log({ order });
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

export default TicketShow;

TicketShow.getInitialProps = async (context, client) => {
  // extract ticketId from browser url
  const { ticketId } = context.query; // ticketId is the name of the file in /pages/tickets
  const response = await client.get(`/api/tickets/${ticketId}`);

  return {
    ticket: response.data,
  };
};

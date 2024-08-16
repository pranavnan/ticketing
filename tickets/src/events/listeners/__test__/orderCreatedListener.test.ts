import { OrderCreatedEvent, OrderStatus } from '@phntickets/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = await Ticket.build({
    title: 'concert',
    price: 99,
    userId: '1234',
  }).save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(), // this is orderId
    status: OrderStatus.Created,
    userId: '1234',
    expiresAt: 'sdfds',
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-expect-error no need to implement whole message object for mock only ack() needed
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('ack the message', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // make sure that ticketUpdatedEvent inside OrderCreatedListener is published successfully

  // telling TS that natsWrapper.client.publish is a jest.Mock function
  // (natsWrapper.client.publish as jest.Mock).mock.calls;
  // {"id":"66b8a2442ab3a010c420bfa7","price":99,"title":"concert","userId":"1234","version":1,"orderId":"66b8a2442ab3a010c420bfa9"}
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

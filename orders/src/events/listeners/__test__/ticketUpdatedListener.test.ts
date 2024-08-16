import { TicketUpdatedEvent } from '@phntickets/common';
import { Ticket } from '../../../models';
import { natsWrapper } from '../../../natsWrapper';
import { TicketUpdatedListener } from '../ticketUpdatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });
  await ticket.save();

  // Create a fake data
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'asfvfdfcdc',
  };

  // Create a false msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all this stuff
  return { listener, data, msg, ticket };
};

it('finds, updates and save a ticket', async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { data, listener, msg, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    // nothing to handle here
  }

  expect(msg.ack).not.toHaveBeenCalled();
});

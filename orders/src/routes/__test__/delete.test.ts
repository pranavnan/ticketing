import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus, Ticket } from '../../models';
import { natsWrapper } from '../../natsWrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  // create a ticket with ticket model
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    id: ticketId,
    price: 209,
    title: 'concert',
  });
  await ticket.save();

  const user = global.signin();
  // create a requst to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  const { body } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // expection to make sure the things is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

// it.todo('emits an order cancelled event');
it('emits an order cancelled event', async () => {
  // create a ticket with ticket model
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    id: ticketId,
    price: 209,
    title: 'concert',
  });
  await ticket.save();

  const user = global.signin();
  // create a requst to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  const { body } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

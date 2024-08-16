import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models';
import mongoose from 'mongoose';

it('fetch the order', async () => {
  // Create a ticket
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    id: ticketId,
    price: 20,
    title: 'concert',
  });
  await ticket.save();
  const user = global.signin();

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another user order', async () => {
  // Create a ticket
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    id: ticketId,
    price: 20,
    title: 'concert',
  });
  await ticket.save();
  const user = global.signin();

  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const userNew = global.signin();
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userNew)
    .send()
    .expect(401);

  // expect(fetchedOrder.id).toEqual(order.id);
});

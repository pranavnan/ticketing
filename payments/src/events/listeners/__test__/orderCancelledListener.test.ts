import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCancelledListener } from '../orderCancelledListener';
import { OrderCancelledEvent, OrderStatus } from '@phntickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: '123erfd',
    version: 0,
  }).save();

  // this version + 1 because we are first updating the order status in order service and this will lead to version increase and from order service we emit an order cancelled event with updated version
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    ticket: {
      id: 'wedfv',
    },
    version: order.version + 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    order,
    data,
    msg,
  };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});
it('acks the message', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

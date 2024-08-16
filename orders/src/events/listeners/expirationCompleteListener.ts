import {
  ExpirationCompleteEvent,
  Listener,
  Subjects,
  OrderStatus,
} from '@phntickets/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';
import { OrderCancelledPublisher } from '../publishers/orderCancelledPublisher';

// event emitted by expiration service and telling that 15 min or whatever time we specify is over so make the order cancelled
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  queueGroupName: string = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }

    // if order is complete then after 15 min we dont need to mard as cancelled.
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({ status: OrderStatus.Cancelled }); // we dont need to reset or clear out the ticket reference because when we create a new order with ticket we are going to find the order with status other than cancelled.

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}

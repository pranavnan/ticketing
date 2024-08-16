import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@phntickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }
    order?.set({ status: OrderStatus.Complete });
    await order.save();

    // We may have to emit the orderUpdateEvent to match the version field in other service, but in this case if the order status is completed then we are not going to do anything with this order.

    msg.ack();
  }
}

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@phntickets/common';
import { Ticket } from '../../models';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, price, title, version } = data;

    const ticket = await Ticket.findByEvent({
      id,
      version,
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({ title: title, price: price });
    await ticket.save();

    msg.ack();
  }
}

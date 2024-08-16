import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@phntickets/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { price, title, id } = data;
    const ticket = Ticket.build({
      id,
      price,
      title,
    });
    await ticket.save();

    msg.ack();
  }
}

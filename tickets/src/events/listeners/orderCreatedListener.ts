import { Listener, OrderCreatedEvent, Subjects } from '@phntickets/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatedPublisher';

// if order created for some ticket then we want to restrict the ticket editing
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const {
      ticket: { id: ticketId },
      id: orderId,
    } = data;
    const ticket = await Ticket.findById(ticketId);

    // If no ticket throw Error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: orderId });

    // save the ticket
    await ticket.save();

    // whenever we update a ticket in the ticket microservice any filed updation, we have to publish an event, because when we make an update the version property of the Ticket document is increased and the subscriber to this should update the version as always.
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}

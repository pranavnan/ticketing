import { Subjects } from './subjects';

// set the coupling between the subject and data
export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    orderId?: string;
    title: string;
    price: number;
    userId: string;
  };
}

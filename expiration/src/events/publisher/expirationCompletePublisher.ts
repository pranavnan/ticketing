import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@phntickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

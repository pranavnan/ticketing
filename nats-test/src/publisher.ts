import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticketCreatedPublisher';
// the (client) viz stan as below is what is going to actually connect to our streaming server and try to exchange some information with it.
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: '123',
    title: 'concert',
    price: 20,
  });
});

process.on('SIGINT', () => {
  // intercept signal
  stan.close();
});
process.on('SIGTERM', () => {
  // terminate signal
  stan.close();
});

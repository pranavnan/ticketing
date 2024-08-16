import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
// the (client) viz stan as below is what is going to actually connect to our streaming server and try to exchange some information with it.
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  // for (let i = 0; i < 10000; ++i)
  stan.publish('ticket:created', data, () => {
    // this callback function will gets executes when we successfully publish the data
    console.log('Event publish');
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

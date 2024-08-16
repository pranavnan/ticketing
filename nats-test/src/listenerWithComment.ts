import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// first param to connect is clusterId, clientId and url in options object
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) // we need to acknowledge the event manually
    .setDeliverAllAvailable() // this will send all the event list from start after our listener created
    .setDurableName('order'); // if an event get processed successfully then in the durable list it is processed and if the event is not processed as the listener service is down then it will remain as it is untill the service is back

  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name',
    options
  );

  // console.log({ subscription });
  subscription.on('message', (msg: Message) => {
    console.dir('Message received');
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack(); // to acknowledgement the event
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

abstract class Listener {
  abstract subject: string; // Name of the channel this listener is going to listen to
  abstract queueGroupName: string; // Name of the queue group this listener will join
  abstract onMessage(data: any, msg: Message): void; // Function to run when a message (event) is received

  private client: Stan; // Pre-initialized NATS client

  protected ackWait = 5 * 1000; // Number of seconds this listener has to ack a message

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    // default subscription options
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    // Code to setup a subscription
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    // Helper function to parse a message
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}

class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-services';
  onMessage(data: any, msg: Message): void {
    console.log('Event data!', data);

    msg.ack();
  }
}

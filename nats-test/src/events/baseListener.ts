import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']; // Name of the channel this listener is going to listen to (subject in NATS world is the name of the channel)
  abstract queueGroupName: string; // Name of the queue group this listener will join
  abstract onMessage(data: T['data'], msg: Message): void; // Function to run when a message (event) is received

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

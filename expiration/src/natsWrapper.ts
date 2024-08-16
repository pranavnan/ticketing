import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan; // why ? that tells the TS that for some period of time this _client is undefined

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, {
      url: url,
    });

    return new Promise((res, rej) => {
      // this.client is the getter as we defined above
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        res();
      });
      this.client.on('error', err => {
        console.log('Connection to NATS failed');
        rej(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();

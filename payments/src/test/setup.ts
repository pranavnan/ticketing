import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
// import request from 'supertest';
// import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  // eslint-disable-next-line no-var
  var signin: (id?: string) => [string];
}

jest.mock('../natsWrapper');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mongo: any;
process.env.STRIPE_KEY =
  'sk_test_51PnB1m01PKqw9sFdMvCILwDZiwitzQ6CyRpL1PBpJuQCHBxaSNZWzZhAXmXIdbhlMzPOjvTTeOcYYKvaordAfiVZ00taAzQVg6';
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const newId = id || new mongoose.Types.ObjectId().toHexString(); // generate random id such that for every sigin we get the new user back
  const payload = {
    id: newId,
    email: 'test@test.com',
  };

  // Create a JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: MY_JWT }
  const session = {
    jwt: token,
  };

  // Turn that session into JSON
  const sessionJson = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64');

  // return a string that the cookie with the encoded data
  return [`session=${base64}`];
};

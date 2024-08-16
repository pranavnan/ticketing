import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // console.log('starting up');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('Connected to mongodb in auth'));
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    console.log(error.message);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();

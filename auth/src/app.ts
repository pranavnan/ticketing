import express from 'express';
import 'express-async-errors'; // error handling for the async function
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/currentUser';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@phntickets/common';

const app = express();

app.set('trust proxy', true); // reason for this is traffic is being proximate to our application through ingress-nginx, express is going to see that proxy and by default express is going to say i dont really trust this proxy https connection, we are adding this because to tell express even though its an proxy of ingress-nginx it should still trust the traffic as being secure.

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    // secure: true, // only https connection
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async () => {
  console.log('Look like someone accessing the route which is not define');
  throw new NotFoundError();
  // next(new NotFoundError());
});

app.use(errorHandler);

export { app };

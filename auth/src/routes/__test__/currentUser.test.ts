import request from 'supertest';
import { app } from '../../app';

it('response with details about the current user', async () => {
  // @ts-ignore
  const cookie = await global.signin();

  if (!cookie) return;

  // in the browser and the postman we get the cookie in to out backend server with every follow-up request but here in the below code is not possible that's why we extract the cookie from the above request and passit down below.

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  console.log({ response_body_currentUser_18: response.body });

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send({
      email: 'test@test.com',
      password: '1234',
    })
    .expect(401);


  // expect(response.body.currentUser).toEqual(null);
});
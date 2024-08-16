import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@phntickets/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log({ email, password });

    // check if user with this email is already exists
    const existingUser = await User.findOne({ email });
    console.log({ existingUser });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // save user in db
    const user = User.build({ email, password });
    await user.save();

    // generate JWT

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // to tell the TS that this variable is already defined
    );

    console.log({ userJwt });

    // store it on session object
    // this session object is going to set in the cookie, first they got turn into JSON then into base64 encoded, so actually to get back the jwt from this we have to do a little bit of work
    req.session = {
      jwt: userJwt,
    };

    res.status(201).json(user);
  }
);

export { router as signUpRouter };

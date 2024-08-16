import express, { Request, Response } from 'express';
import { requireAuth } from '@phntickets/common';
import { Order } from '../models';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  // find all orders created by the authenticated user
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.send(orders);
});

export { router as indexOrderRouter };

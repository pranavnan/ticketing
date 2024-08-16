import express from 'express';

const router = express.Router();

router.post(
  '/api/users/signout',
  async (req: express.Request, res: express.Response) => {
    req.session = null;

    res.send({});
  }
);

export { router as signOutRouter };

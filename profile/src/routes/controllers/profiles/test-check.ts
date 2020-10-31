import { Request, Response } from 'express';

const test = async (req: Request, res: Response) => {
  console.log(req.user);
  return res.status(200).json({
    status: 'success',
    data: {
      msg: 'profile works',
    },
  });
};

export { test };

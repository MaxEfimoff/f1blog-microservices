import { Request, Response } from 'express';

const test = async (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'success',
    data: {
      msg: 'groups work',
    },
  });
};

export { test };

import { Request, Response } from 'express';
import { User } from '../../../db/models/User';
import { BadRequestError } from '@f1blog/common';

const all = async (req: Request, res: Response) => {
  const users = await User.find().limit(10).sort({ createdAt: -1 });

  if (!users) {
    throw new BadRequestError('There are no active users');
  }

  return res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

export { all };

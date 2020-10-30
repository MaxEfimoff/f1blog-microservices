import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError } from '@f1blog/common';
import { Group } from '../../../db/models/Group';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchAllGroups = async (req: UserRequest, res: Response) => {
  const groups = await Group.find().limit(10).sort({ createdAt: -1 });

  if (!groups) {
    throw new NotFoundError();
  }

  return res.status(201).json({
    status: 'success',
    results: groups.length,
    data: {
      groups,
    },
  });
};

export { fetchAllGroups };

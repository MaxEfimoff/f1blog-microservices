import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError } from '@f1blog/common';
import { Team } from '../../../db/models/Team';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchAllTeams = async (req: UserRequest, res: Response) => {
  const teams = await Team.find().limit(10).sort({ createdAt: -1 });

  if (!teams) {
    throw new NotFoundError();
  }

  return res.status(201).json({
    status: 'success',
    results: teams.length,
    data: {
      teams,
    },
  });
};

export { fetchAllTeams };

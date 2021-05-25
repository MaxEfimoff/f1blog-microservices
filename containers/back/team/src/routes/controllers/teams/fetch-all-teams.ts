import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError } from '@f1blog/common';
import { Team } from '../../../db/models/Team';

const fetchAllTeams = async (req: Request, res: Response) => {
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

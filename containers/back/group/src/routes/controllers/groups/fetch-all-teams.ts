import { Request, Response } from 'express';
import { Team } from '../../../db/models/Team';
import { BadRequestError } from '@f1blog/common';

const fetchAllTeams = async (req: Request, res: Response) => {
  const teams = await Team.find();

  console.log(teams);

  if (!teams) {
    throw new BadRequestError('There are no active teams');
  }

  return res.status(200).json({
    status: 'success',
    results: teams.length,
    data: {
      teams,
    },
  });
};

export { fetchAllTeams };

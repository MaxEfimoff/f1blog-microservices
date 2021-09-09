import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError, BadRequestError } from '@f1blog/common';
import { Team } from '../../../db/models/Team';
import { Profile } from '../../../db/models/Profile';

const fetchAllUsersInTeam = async (req: Request, res: Response) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    throw new BadRequestError('There is no team with this id');
  } else {
    const foundTeam = await Team.find({
      members: { $in: team.members.map((a) => a._id) },
    })
      .populate('profile')
      .limit(10)
      .sort({
        createdAt: -1,
      });

    if (!foundTeam) {
      throw new NotFoundError();
    }

    const teamMembers = foundTeam[0].members;

    return res.status(200).json({
      status: 'success',
      results: teamMembers.length,
      data: {
        teamMembers,
      },
    });
  }
};

export { fetchAllUsersInTeam };

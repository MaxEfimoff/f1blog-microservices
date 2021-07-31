import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError, BadRequestError } from '@f1blog/common';
import { Group } from '../../../db/models/Group';
import { Team } from '../../../db/models/Team';
import { Profile } from '../../../db/models/Profile';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchAllGroupsInTeam = async (req: UserRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const team = await Team.findById(id);

    if (!team) {
      throw new NotFoundError();
    }

    console.log('Team', team);

    const groups = await Group.find({ team: team }).limit(10).sort({ createdAt: -1 });

    console.log('groups', groups);

    if (!groups) {
      throw new NotFoundError();
    }

    return res.status(200).json({
      status: 'success',
      results: groups.length,
      data: {
        groups,
      },
    });
  }
};

export { fetchAllGroupsInTeam };

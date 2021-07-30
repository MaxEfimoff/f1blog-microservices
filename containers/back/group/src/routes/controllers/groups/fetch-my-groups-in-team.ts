import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError, BadRequestError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { Group } from '../../../db/models/Group';
import { Team } from '../../../db/models/Team';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchMyGroups = async (req: UserRequest, res: Response) => {
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
    console.log('Current profile', profile);
    const groups = await Group.find({ profile: profile }).limit(10).sort({
      createdAt: -1,
    });

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

export { fetchMyGroups };

import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
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

const fetchGroupInTeam = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const { id, groupId } = req.params;

    const team = await Team.findById(id);

    console.log(team);

    if (!team) {
      throw new BadRequestError('You should create team first');
    }

    const group = await Group.findById(groupId);
    console.log(group);

    if (!group) {
      throw new BadRequestError('You should create group first');
    }

    return res.status(200).json({
      status: 'success',
      data: {
        group,
      },
    });
  }
};

export { fetchGroupInTeam };

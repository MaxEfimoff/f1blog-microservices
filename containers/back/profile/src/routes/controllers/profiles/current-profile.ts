import { Request, Response } from 'express';
import { Profile } from '../../../db/models/Profile';
import { User } from '../../../db/models/User';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@f1blog/common';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

const current = async (req: UserRequest, res: Response) => {
  const user = await await User.findOne({ id: req.user.id });

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user }).populate('user');

  if (!profile) {
    throw new BadRequestError('There are no active profile for this user');
  }

  if (profile.user.id !== user.id) {
    throw new NotAuthorizedError();
  }

  return res.status(200).json({
    status: 'success',
    data: {
      profile,
    },
  });
};

export { current };

import { Request, Response } from 'express';
import { Profile } from '../../../db/models/Profile';
import { BadRequestError } from '@f1blog/common';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

const getProfileById = async (req: UserRequest, res: Response) => {
  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    throw new BadRequestError('There are no active profile for this user');
  }

  return res.status(200).json({
    status: 'success',
    data: {
      profile,
    },
  });
};

export { getProfileById };

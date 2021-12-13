import { Request, Response } from 'express';
import { Profile } from '../../../db/models/profile.schema';
import { BadRequestError } from '@f1blog/common';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

const getProfileByHandle = async (req: UserRequest, res: Response) => {
  const profile = await Profile.findOne({
    handle: req.params.handle,
  });

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

export { getProfileByHandle };

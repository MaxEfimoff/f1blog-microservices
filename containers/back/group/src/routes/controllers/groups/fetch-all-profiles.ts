import { Request, Response } from 'express';
import { Profile } from '../../../db/models/Profile';
import { BadRequestError } from '@f1blog/common';

const fetchAllProfiles = async (req: Request, res: Response) => {
  const profiles = await Profile.find();

  console.log(profiles);

  if (!profiles) {
    throw new BadRequestError('There are no active profiles');
  }

  return res.status(200).json({
    status: 'success',
    results: profiles.length,
    data: {
      profiles,
    },
  });
};

export { fetchAllProfiles };

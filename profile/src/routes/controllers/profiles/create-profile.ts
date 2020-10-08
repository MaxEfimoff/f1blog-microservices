import { Request, Response } from 'express';
import 'express-async-errors';
import bcrypt from 'bcrypt';
import { BadRequestError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

const createProfile = async (req: UserRequest, res: Response) => {
  let { handle, avatar, background, status } = req.body;
  const user = req.user.id;

  const profile = await Profile.findOne({ user: user });

  if (profile) {
    throw new BadRequestError('Profile already exists');
  } else {
    const newProfile = Profile.build({
      user: req.user,
      handle,
      avatar,
      background,
      status,
      date: Date.now(),
    });

    // Save New user to DB
    const savedUser = await newProfile.save();
  }
};

export { createProfile };

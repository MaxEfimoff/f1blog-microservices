import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { User } from '../../../db/models/User';
import { ProfileCreatedPublisher } from '../../../events/publishers/profile-created-publisher';
import { natsWrapper } from '../../../nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

const createProfile = async (req: UserRequest, res: Response) => {
  let { handle, avatar, background, status } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user });

  if (profile) {
    throw new BadRequestError('Profile already exists');
  } else {
    const newProfile = Profile.build({
      user: user,
      handle,
      avatar,
      background,
      status,
      date: Date.now(),
    });

    // Save New Profile to DB
    await newProfile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Publish a ProfileCreated event
    new ProfileCreatedPublisher(natsWrapper.client).publish({
      id: newProfile.id,
      handle: newProfile.handle,
      version: newProfile.version,
      user: {
        id: user.id,
      },
    });

    return res.status(201).json({
      status: 'success',
      data: {
        newProfile,
      },
    });
  }
};

export { createProfile };

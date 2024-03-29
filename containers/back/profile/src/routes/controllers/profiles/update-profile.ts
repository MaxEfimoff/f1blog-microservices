import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/profile.schema';
import { User } from '../../../db/models/user.schema';
import { ProfileUpdatedPublisher } from '../../../events/publishers/profile-updated-publisher';
import { natsWrapper } from '../../../nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

interface Body {
  handle?: string;
  avatar?: string;
  background?: string;
  status?: string;
}

const updateProfile = async (req: UserRequest, res: Response) => {
  let { handle, avatar, background }: Body = req.body;

  const user = await User.findOne({ id: req.user.id });

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    profile.handle = handle;
    profile.avatar = avatar;
    profile.background = background;
    profile.date = Date.now();

    console.log(profile);

    // Save New Profile to DB
    await profile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Publish a Profile Updated event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: profile.id,
      handle: profile.handle,
      avatar: profile.avatar,
      background: profile.background,
      version: profile.version,
      user_id: req.user.id,
      myTeams: profile.myTeams,
      joinedTeams: profile.joinedTeams,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        profile,
      },
    });
  }
};

export { updateProfile };

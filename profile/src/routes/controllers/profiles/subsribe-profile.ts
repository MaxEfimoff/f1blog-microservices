import { Request, Response } from 'express';
import 'express-async-errors';
import { Profile } from '../../../db/models/Profile';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { User } from '../../../db/models/User';
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

const subscribeProfile = async (req: UserRequest, res: Response) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const anotherUserProfile = await Profile.findById(req.params.id);

    if (
      profile.subscribedProfiles.filter(
        (newProfile) => newProfile == anotherUserProfile.id
      ).length > 0
    ) {
      throw new BadRequestError('You already subscribed to this profile');
    }

    profile.subscribedProfiles.unshift(anotherUserProfile);

    // Save New NewsItem to DB
    await profile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Publish a NewsItemUpdatyed event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: profile.id,
      handle: profile.handle,
      avatar: profile.avatar,
      background: profile.background,
      version: profile.version,
      user_id: req.user.id,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        profile,
      },
    });
  }
};

export { subscribeProfile };

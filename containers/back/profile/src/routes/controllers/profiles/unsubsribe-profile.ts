import { Request, Response } from 'express';
import 'express-async-errors';
import { Profile } from '../../../db/models/profile.schema';
import { BadRequestError, NotFoundError } from '@f1blog/common';
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

const unsubscribeProfile = async (req: UserRequest, res: Response) => {
  const user = await User.findOne({ id: req.user.id });

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const subscribedProfile = await Profile.findById(req.params.id);

    // Remove subscribed profile from subscribedProfiles array
    const removeIndex = profile.subscribedProfiles.findIndex((x) => x === subscribedProfile.id);

    profile.subscribedProfiles.splice(removeIndex, 1);

    // Remove profile from subscribed profile's subscribers array
    const removeSubscribersIndex = subscribedProfile.subscribers.findIndex((x) => x === profile.id);

    subscribedProfile.subscribers.splice(removeSubscribersIndex, 1);

    // Save profile to DB
    await profile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Save profile to DB
    await subscribedProfile.save((err) => {
      if (err) throw new BadRequestError('Could not save subscribed profile to DB');
    });

    // Publish a ProfileUpdated event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: profile.id,
      handle: profile.handle,
      avatar: profile.avatar,
      background: profile.background,
      version: profile.version,
      user_id: req.user.id,
    });

    // Publish a ProfileUpdated event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: subscribedProfile.id,
      handle: subscribedProfile.handle,
      avatar: subscribedProfile.avatar,
      background: subscribedProfile.background,
      version: subscribedProfile.version,
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

export { unsubscribeProfile };

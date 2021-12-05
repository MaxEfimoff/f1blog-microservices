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

const subscribeToProfile = async (req: UserRequest, res: Response) => {
  const user = await User.findOne({ id: req.user.id });

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user });

  const subscribedProfile = await Profile.findById(req.params.id);

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    if (
      profile.subscribedProfiles.filter(
        (subscrProfile) => subscrProfile.toString() === subscribedProfile.id,
      ).length > 0
    ) {
      throw new BadRequestError('You have already subscribed to this user');
    }

    profile.subscribedProfiles.unshift(subscribedProfile);

    subscribedProfile.subscribers.unshift(profile);

    // Save New subscribed profile to DB
    await profile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Save your profile to Subscribed profile to DB
    await subscribedProfile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Publish a Profile Updated event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: profile.id,
      handle: profile.handle,
      version: profile.version,
      user_id: req.user.id,
      subscribedProfiles: subscribedProfile._id,
    });

    // Publish a Profile Updated event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: subscribedProfile.id,
      handle: subscribedProfile.handle,
      version: subscribedProfile.version,
      user_id: req.user.id,
      subscribedProfiles: subscribedProfile._id,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        profile,
      },
    });
  }
};

export { subscribeToProfile };

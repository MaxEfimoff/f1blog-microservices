import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { User } from '../../../db/models/User';
import { ProfileDeletedPublisher } from '../../../events/publishers/profile-deleted-publisher';
import { natsWrapper } from '../../../nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const deleteProfile = async (req: UserRequest, res: Response) => {
  const user = await User.findOne({ id: req.user.id });

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOneAndRemove({ user });

  if (!profile) {
    throw new BadRequestError('There is no profile for the user');
  } else {
    // Publish a ProfileDeleted event
    new ProfileDeletedPublisher(natsWrapper.client).publish({
      id: profile.id,
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

export { deleteProfile };

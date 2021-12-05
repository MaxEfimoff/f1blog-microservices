import { Request, Response } from 'express';
import { Profile } from '../../../db/models/profile.schema';
import { User } from '../../../db/models/user.schema';
import { BadRequestError, NotFoundError } from '@f1blog/common';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

const fetchSubscribers = async (req: UserRequest, res: Response) => {
  const user = await User.findOne({ id: req.user.id });

  console.log(user);
  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user }).populate('user');

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const subscribers = profile.subscribers;

    return res.status(200).json({
      status: 'success',
      results: subscribers.length,
      data: {
        subscribers,
      },
    });
  }
};

export { fetchSubscribers };

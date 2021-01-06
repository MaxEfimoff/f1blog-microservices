import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError, BadRequestError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { NewsItem } from '../../../db/models/NewsItem';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchMySubscribedProfilesNewsItems = async (
  req: UserRequest,
  res: Response
) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  console.log(profile.subscribedProfiles);

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const newsItems = await NewsItem.find({
      profile: { $in: profile.subscribedProfiles.map((a) => a._id) },
    })
      .limit(10)
      .sort({ date: -1 });

    if (!newsItems) {
      throw new NotFoundError();
    }

    return res.status(200).json({
      status: 'success',
      results: newsItems.length,
      data: {
        newsItems,
      },
    });
  }
};

export { fetchMySubscribedProfilesNewsItems };

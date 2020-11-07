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

const fetchProfileIdNewsItems = async (req: UserRequest, res: Response) => {
  const profile = await Profile.findOne({ _id: req.params.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const newsItems = await NewsItem.find({ profile: profile }).limit(10).sort({
      createdAt: -1,
    });

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

export { fetchProfileIdNewsItems };

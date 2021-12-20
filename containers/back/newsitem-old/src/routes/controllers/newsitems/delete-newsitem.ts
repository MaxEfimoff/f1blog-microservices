import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError, NotAuthorizedError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { NewsItem } from '../../../db/models/NewsItem';
import { NewsItemDeletedPublisher } from '../../../events/publishers/newsitem-deleted-publisher';
import { natsWrapper } from '../../../nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const deleteNewsItem = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const newsItem = await NewsItem.findById(req.params.id);

    if (newsItem.profile.toString() !== profile.id) {
      return new NotAuthorizedError();
    }

    await newsItem.remove();

    // Publish a NewsItemDeleted event
    new NewsItemDeletedPublisher(natsWrapper.client).publish({
      id: newsItem.id,
      title: null,
      text: null,
      image: null,
      version: newsItem.version,
      profile_id: profile.id,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        newsItem,
      },
    });
  }
};

export { deleteNewsItem };

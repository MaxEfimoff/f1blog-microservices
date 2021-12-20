import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { NewsItem, NewsItemDoc } from '../../../db/models/NewsItem';
import { NewsItemUpdatedPublisher } from '../../../events/publishers/newsitem-updated-publisher';
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
  title: string;
  text: string;
  image: string;
}

const updateNewsItem = async (req: UserRequest, res: Response) => {
  let { title, text, image }: Body = req.body;

  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const newsItem: NewsItemDoc = await NewsItem.findById(req.params.id);

    if (!newsItem) {
      throw new BadRequestError('You should create news item first');
    }

    if (newsItem.profile.toString() !== profile._id.toString()) {
      throw new BadRequestError('You can not update this news item');
    }

    newsItem.title = title;
    newsItem.text = text;
    newsItem.image = image;
    newsItem.updatedAt = Date.now();

    console.log(newsItem);

    // Save New NewsItem to DB
    await newsItem.save((err) => {
      if (err) throw new BadRequestError('Could not save news item to DB');
    });

    // Publish a NewsItemUpdatyed event
    new NewsItemUpdatedPublisher(natsWrapper.client).publish({
      id: newsItem.id,
      title: newsItem.title,
      text: newsItem.text,
      image: newsItem.image,
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

export { updateNewsItem };

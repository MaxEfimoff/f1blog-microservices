import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { NewsItem } from '../../../db/models/NewsItem';
import { NewsItemCreatedPublisher } from '../../../events/publishers/newsitem-created-publisher';
import { natsWrapper } from '../../../nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const createNewsItem = async (req: UserRequest, res: Response) => {
  let { title, text, image } = req.body;

  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const newNewsItem = NewsItem.build({
      title,
      text,
      image,
      profile: profile,
      createdAt: Date.now(),
    });

    console.log(newNewsItem);

    // Save New NewsItem to DB
    await newNewsItem.save((err) => {
      if (err) throw new BadRequestError('Could not save news item to DB');
    });

    // Publish a NewsItemCreated event
    new NewsItemCreatedPublisher(natsWrapper.client).publish({
      id: newNewsItem.id,
      title: newNewsItem.title,
      text: newNewsItem.text,
      image: newNewsItem.image,
      version: newNewsItem.version,
      profile_id: profile.id,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        newNewsItem,
      },
    });
  }
};

export { createNewsItem };

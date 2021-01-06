import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { NewsItem } from '../../../db/models/NewsItem';
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

const deleteNewsItemThread = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const newsItem = await NewsItem.findById(req.params.newsitem_id);

    if (!newsItem) {
      throw new BadRequestError('You should create news item first');
    }

    const newsItemthread = newsItem.threads.filter(
      (thread) => thread._id.toString() === req.params.thread_id
    )[0];

    if (!newsItemthread) {
      throw new BadRequestError('Thread does not exist');
    }

    if (newsItemthread.profile.toString() !== profile.id) {
      throw new BadRequestError('You can not delete this thread');
    }

    // Get remove index
    const removeIndex = newsItem.threads
      .map((item) => item._id.toString())
      .indexOf(req.params.thread_id);

    // Splice thread out of array
    newsItem.threads.splice(removeIndex, 1);
    newsItem.save();

    // Publish a NewsItemDeleted event
    new NewsItemUpdatedPublisher(natsWrapper.client).publish({
      id: newsItem.id,
      title: newsItem.title,
      text: newsItem.text,
      image: newsItem.image,
      profile_id: profile.id,
      likes: newsItem.likes,
      dislikes: newsItem.dislikes,
      // threads: newsItem.threads,
      version: newsItem.version,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        newsItem,
      },
    });
  }
};

export { deleteNewsItemThread };

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

const dislikeNewsItemThreadComment = async (
  req: UserRequest,
  res: Response
) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const newsItem: NewsItemDoc = await NewsItem.findById(
      req.params.newsitem_id
    );

    if (!newsItem) {
      throw new BadRequestError('You should create news item first');
    }

    const newsItemthread = newsItem.threads.filter(
      (thread) => thread._id.toString() === req.params.thread_id
    )[0];

    if (!newsItemthread) {
      throw new BadRequestError('Thread does not exist');
    }

    const newsItemthreadComment = newsItemthread.comments.filter(
      (comment) => comment._id.toString() === req.params.comment_id
    )[0];

    if (!newsItemthreadComment) {
      throw new BadRequestError('Comment does not exist');
    }

    if (
      newsItemthreadComment.dislikes.filter(
        (dislike) => dislike.toString() === profile.id
      ).length > 0
    ) {
      throw new BadRequestError('You already disliked this comment');
    }

    newsItemthreadComment.dislikes.unshift(profile);

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
      dislikes: newsItem.dislikes,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        newsItem,
      },
    });
  }
};

export { dislikeNewsItemThreadComment };

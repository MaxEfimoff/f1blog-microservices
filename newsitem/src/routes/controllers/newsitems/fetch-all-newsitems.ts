import { Request, Response } from 'express';
import 'express-async-errors';
import { natsWrapper } from '../../../nats-wrapper';
import { NotFoundError } from '@f1blog/common';
import { NewsItem } from '../../../db/models/NewsItem';
import { FetchAllNewsItemsPublisher } from '../../../events/publishers/fetch-all-newsitems-publisher';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchAllNewsItems = async (req: UserRequest, res: Response) => {
  // Publishes an event for NewsItem Redis service
  new FetchAllNewsItemsPublisher(natsWrapper.client).publish({});

  const newsItems = await NewsItem.find().limit(10).sort({ createdAt: -1 });

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
};

export { fetchAllNewsItems };

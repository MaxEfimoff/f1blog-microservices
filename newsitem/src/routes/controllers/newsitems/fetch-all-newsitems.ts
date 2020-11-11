import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError } from '@f1blog/common';
import { NewsItem } from '../../../db/models/NewsItem';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}
//
//

const fetchAllNewsItems = async (req: UserRequest, res: Response) => {
  const newsItems = await NewsItem.find({})
    .limit(10)
    .sort({ createdAt: -1 })
    .cache({ key: 'all' });

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

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

const fetchNewsItemById = async (req: UserRequest, res: Response) => {
  const newsItem = await NewsItem.findById(req.params.id);

  if (!newsItem) {
    throw new NotFoundError();
  }

  return res.status(200).json({
    status: 'success',
    data: {
      newsItem,
    },
  });
};

export { fetchNewsItemById };

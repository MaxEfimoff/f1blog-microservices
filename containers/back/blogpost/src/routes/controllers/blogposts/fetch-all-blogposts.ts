import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError } from '@f1blog/common';
import { BlogPost } from '../../../db/models/Blogpost';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchAllBlogPosts = async (req: UserRequest, res: Response) => {
  const BlogPosts = await BlogPost.find().limit(10).sort({ createdAt: -1 });

  if (!BlogPosts) {
    throw new NotFoundError();
  }

  return res.status(201).json({
    status: 'success',
    results: BlogPosts.length,
    data: {
      BlogPosts,
    },
  });
};

export { fetchAllBlogPosts };

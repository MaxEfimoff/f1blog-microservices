import { Request, Response } from 'express';
import 'express-async-errors';
import { NotFoundError, BadRequestError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { BlogPost } from '../../../db/models/Blogpost';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchMyBlogPosts = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const blogPosts = await BlogPost.find({ profile: profile }).limit(10).sort({
      createdAt: -1,
    });

    if (!blogPosts) {
      throw new NotFoundError();
    }

    return res.status(200).json({
      status: 'success',
      results: blogPosts.length,
      data: {
        blogPosts,
      },
    });
  }
};

export { fetchMyBlogPosts };

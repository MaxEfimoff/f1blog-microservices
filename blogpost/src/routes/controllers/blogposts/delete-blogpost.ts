import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { BlogPost } from '../../../db/models/Blogpost';
// import { NewsItemDeletedPublisher } from '../../../events/publishers/newsitem-deleted-publisher';
import { natsWrapper } from '../../../nats-wrapper';
import { NotAuthorizedError } from '@f1blog/common';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const deleteBlogPost = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const blogPost = await BlogPost.findById(req.params.id);

    if (blogPost.profile.toString() !== profile.id) {
      return new NotAuthorizedError();
    }

    await blogPost.remove();

    // // Publish a BlogPostDeleted event
    // new BlogPostDeletedPublisher(natsWrapper.client).publish({
    //   id: blogPost.id,
    //   title: null,
    //   text: null,
    //   image: null,
    //   version: blogPost.version,
    //   profile_id: profile.id,
    // });

    return res.status(201).json({
      status: 'success',
      data: {
        blogPost,
      },
    });
  }
};

export { deleteBlogPost };

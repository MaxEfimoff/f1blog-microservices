import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../../../group/src/db/models/Profile';
import { BlogPost } from '../../../../../group/src/db/models/Blogpost';
import { Group } from '../../../../../group/src/db/models/Group';
import { BlogPostCreatedPublisher } from '../../../../../group/src/events/publishers/blogpost-created-publisher';
import { natsWrapper } from '../../../../../group/src/nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const createGroupBlogPost = async (req: UserRequest, res: Response) => {
  let { title, text, image } = req.body;

  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const group = await Group.findById(req.params.id);

    const newBlogPost = BlogPost.build({
      title,
      text,
      image,
      profile: profile,
      group,
      createdAt: Date.now(),
    });

    console.log(newBlogPost);

    // Save New BlogPost to DB
    await newBlogPost.save((err) => {
      if (err) throw new BadRequestError('Could not save news item to DB');
    });

    group.posts.unshift(newBlogPost.id);

    await group.save();

    // Publish a BlogPostCreated event
    new BlogPostCreatedPublisher(natsWrapper.client).publish({
      id: newBlogPost.id,
      title: newBlogPost.title,
      text: newBlogPost.text,
      image: newBlogPost.image,
      version: newBlogPost.version,
      group_id: group.id,
      profile_id: profile.id,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        newBlogPost,
      },
    });
  }
};

export { createGroupBlogPost };

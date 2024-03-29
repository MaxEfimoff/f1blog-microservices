import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { BlogPost } from '../../../db/models/Blogpost';
import { BlogPostCreatedPublisher } from '../../../events/publishers/blogpost-created-publisher';
import { natsWrapper } from '../../../nats-wrapper';
import { Group } from '../../../db/models/Group';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const createBlogPost = async (req: UserRequest, res: Response) => {
  let { title, text, image, groupId } = req.body;

  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    if (!groupId) {
      throw new NotFoundError();
    }

    const group = await Group.findById(groupId);

    if (!group) {
      throw new BadRequestError('Group with this id does not exist');
    }

    if (group.members.filter((member) => member.toString() === profile.id).length === 0) {
      throw new BadRequestError('Only group members can create posts');
    }

    const newBlogPost = BlogPost.build({
      title,
      text,
      image,
      profile,
      createdAt: Date.now(),
    });

    console.log(newBlogPost);

    // Save New BlogPost to DB
    await newBlogPost.save((err) => {
      if (err) throw new BadRequestError('Could not save news item to DB');
    });

    // // Publish a BlogPostCreated event
    // new BlogPostCreatedPublisher(natsWrapper.client).publish({
    //   id: newBlogPost.id,
    //   title: newBlogPost.title,
    //   text: newBlogPost.text,
    //   image: newBlogPost.image,
    //   version: newBlogPost.version,
    //   profile_id: profile.id,
    //   group_id: group,
    // });

    return res.status(201).json({
      status: 'success',
      data: {
        newBlogPost,
      },
    });
  }
};

export { createBlogPost };

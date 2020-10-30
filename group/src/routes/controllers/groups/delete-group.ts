import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { Group } from '../../../db/models/Group';
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

const deleteGroup = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const group = await Group.findById(req.params.id);

    if (group.profile.toString() !== profile.id) {
      return new NotAuthorizedError();
    }

    await group.remove();

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
        group,
      },
    });
  }
};

export { deleteGroup };

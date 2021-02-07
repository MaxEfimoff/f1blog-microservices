import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { Group } from '../../../db/models/Group';
import { GroupCreatedPublisher } from '../../../events/publishers/group-created-publisher';
import { natsWrapper } from '../../../nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const createGroup = async (req: UserRequest, res: Response) => {
  let { title } = req.body;

  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    console.log(profile);
    const newGroup = Group.build({
      title,
      profile: profile,
      createdAt: Date.now(),
    });

    // Save New Group to DB
    await newGroup.save((err) => {
      if (err) throw new BadRequestError('Could not save news item to DB');
    });

    // Publish a GroupCreated event
    new GroupCreatedPublisher(natsWrapper.client).publish({
      id: newGroup.id,
      title: newGroup.title,
      version: newGroup.version,
      profile_id: profile.id,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        newGroup,
      },
    });
  }
};

export { createGroup };

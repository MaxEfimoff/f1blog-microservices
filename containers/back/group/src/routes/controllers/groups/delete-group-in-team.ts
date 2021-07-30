import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { Group } from '../../../db/models/Group';
import { Team } from '../../../db/models/Team';
import { GroupDeletedPublisher } from '../../../events/publishers/group-deleted-publisher';
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

const deleteGroupInTeam = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const { groupId, teamId } = req.params;

    const group = await Group.findById(groupId);
    const team = await Team.findById(teamId);

    if (!team) {
      throw new BadRequestError('You should create team first');
    }

    if (!group) {
      throw new BadRequestError('You should create group first');
    }

    if (group.profile.toString() !== profile.id) {
      return new NotAuthorizedError();
    }

    await Group.findByIdAndRemove({ _id: req.params.groupId });

    // Publish a GroupDeleted event
    new GroupDeletedPublisher(natsWrapper.client).publish({
      id: group.id,
      title: null,
      profile_id: null,
      version: group.version,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        group,
      },
    });
  }
};

export { deleteGroupInTeam };

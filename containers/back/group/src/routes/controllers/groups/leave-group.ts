import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { Team, TeamDoc } from '../../../db/models/Team';
import { Group, GroupDoc } from '../../../db/models/Group';
import { TeamUpdatedPublisher } from '../../../events/publishers/team-updated-publisher';
import { natsWrapper } from '../../../nats-wrapper';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const leaveGroup = async (req: UserRequest, res: Response) => {
  const user = req.user;
  const { id, groupId } = req.params;
  console.log('ID', id);
  console.log('GROUPID', groupId);

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });
  console.log('PROFILE', profile.id);

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const team: TeamDoc = await Team.findById(id);

    if (!team) {
      throw new BadRequestError('You should create team first');
    }
    console.log('TEAMMEMBERS', team);
    if (team.members.filter((member) => member.toString() === profile.id).length === 0) {
      throw new BadRequestError('You are not a member of this team');
    }

    const group: GroupDoc = await Group.findById(groupId);

    // Get the remove index
    const removeIndex = group.members.map((item: any) => item._id.toString()).indexOf(profile.id);

    // Splice out of array
    group.members.splice(removeIndex, 1);
    profile.joinedGroups.map((item) => item._id.toString()).indexOf(team.id);

    // Save team to DB
    await group.save((err) => {
      if (err) throw new BadRequestError('Could not save group to DB');
    });

    await profile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Publish a TeamUpdated event
    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      members: team.members,
      version: team.version,
      profile_id: profile.id,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        group,
      },
    });
  }
};

export { leaveGroup };

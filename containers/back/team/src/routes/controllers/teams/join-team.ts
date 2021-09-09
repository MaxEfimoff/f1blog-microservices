import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { Profile } from '../../../db/models/Profile';
import { Team, TeamDoc } from '../../../db/models/Team';
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

const joinTeam = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const team: TeamDoc = await Team.findById(req.params.id);

    if (!team) {
      throw new BadRequestError('You should create team first');
    }

    if (team.members.filter((member) => member.toString() === profile.id).length > 0) {
      throw new BadRequestError('You are already a member of this team');
    }

    team.members.unshift(profile);

    // Save team to DB
    await team.save((err) => {
      if (err) throw new BadRequestError('Could not save team to DB');
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
        team,
      },
    });
  }
};

export { joinTeam };

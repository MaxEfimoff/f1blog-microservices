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

const leaveTeam = async (req: UserRequest, res: Response) => {
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

    if (team.members.filter((member) => member.toString() === profile.id).length === 0) {
      throw new BadRequestError('You are not a member of this team');
    }

    // Get the remove index
    const removeIndex = team.members.map((item) => item._id.toString()).indexOf(profile.id);

    // Splice out of array
    team.members.splice(removeIndex, 1);

    const removeTeamIndex = profile.joinedTeams.map((item) => item._id.toString()).indexOf(team.id);

    console.log(team);

    // Save New team to DB
    await team.save((err) => {
      if (err) throw new BadRequestError('Could not save team to DB');
    });

    await profile.save((err) => {
      if (err) throw new BadRequestError('Could not save profile to DB');
    });

    // Publish a TeamUpdatyed event
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

export { leaveTeam };

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
    isSuperadmin: boolean;
    iat: number;
    exp: number;
  };
}

interface Body {
  title: string;
}

const updateTeam = async (req: UserRequest, res: Response) => {
  let { title }: Body = req.body;

  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  if (user.isSuperadmin == false) {
    throw new BadRequestError('Only superadmin can update team');
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError('You should create profile first');
  } else {
    const team: TeamDoc = await Team.findById(req.params.id);

    if (!team) {
      throw new BadRequestError('You should create news item first');
    }

    if (team.profile.toString() !== profile._id.toString()) {
      throw new BadRequestError('You can not update this news item');
    }

    team.title = title;
    team.updatedAt = Date.now();

    console.log(team);

    // Save New team to DB
    await team.save((err) => {
      if (err) throw new BadRequestError('Could not save news item to DB');
    });

    // Publish a TeamUpdatyed event
    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
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

export { updateTeam};

import { Request, Response } from "express";
import "express-async-errors";
import { BadRequestError, NotFoundError } from "@f1blog/common";
import { Profile } from "../../../db/models/Profile";
import { Team } from "../../../db/models/Team";
import { natsWrapper } from "../../../nats-wrapper";
import { NotAuthorizedError } from "@f1blog/common";
import { TeamDeletedPublisher } from "../../../events/publishers/team-deleted-publisher";

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
  };
}

const deleteTeam = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  // if (user.role === 'superadmin') {
  //   throw new BadRequestError('Only superadmin can delete a team');
  // }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError("You should create profile first");
  } else {
    const team = await Team.findById(req.params.id);

    if (team.profile.toString() !== profile.id) {
      return new NotAuthorizedError();
    }

    await team.remove();

    // Publish a TeamDeleted event
    new TeamDeletedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: null,
      version: team.version,
      profile_id: profile.id,
    });

    return res.status(201).json({
      status: "success",
      data: {
        team,
      },
    });
  }
};

export { deleteTeam };

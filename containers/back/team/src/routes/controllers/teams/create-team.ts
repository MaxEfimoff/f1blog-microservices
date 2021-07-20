import { Request, Response } from "express";
import "express-async-errors";
import { BadRequestError, NotFoundError } from "@f1blog/common";
import { Profile } from "../../../db/models/Profile";
import { Team } from "../../../db/models/Team";
import { TeamCreatedPublisher } from "../../../events/publishers/team-created-publisher";
import { natsWrapper } from "../../../nats-wrapper";

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
  };
}

const createTeam = async (req: UserRequest, res: Response) => {
  let { title } = req.body;

  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  // if (user.role === 'superadmin') {
  //   throw new BadRequestError('Only superadmin can create a team');
  // }

  const profile = await Profile.findOne({ user_id: req.user.id });

  console.log("Profile", profile);

  if (!profile) {
    throw new BadRequestError("You should create profile first");
  } else {
    console.log(profile);
    const newTeam = Team.build({
      title,
      profile: profile,
      createdAt: Date.now(),
    });

    // Save New Team to DB
    await newTeam.save((err) => {
      if (err) throw new BadRequestError("Could not save team to DB");
    });

    // Publish a TeamCreated event
    new TeamCreatedPublisher(natsWrapper.client).publish({
      id: newTeam.id,
      title: newTeam.title,
      version: newTeam.version,
      profile_id: profile.id,
    });

    return res.status(201).json({
      status: "success",
      data: {
        newTeam,
      },
    });
  }
};

export { createTeam };

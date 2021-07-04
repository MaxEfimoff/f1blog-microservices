import { Request, Response } from "express";
import "express-async-errors";
import { BadRequestError, NotFoundError } from "@f1blog/common";
import { Profile } from "../../../db/models/Profile";
import { Team, TeamDoc } from "../../../db/models/Team";
import { TeamUpdatedPublisher } from "../../../events/publishers/team-updated-publisher";
import { ProfileUpdatedPublisher } from "../../../events/publishers/profile-updated-publisher";
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

interface Body {
  title: string;
}

const deleteUserFromTeam = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  // if (user.role === 'superadmin') {
  //   throw new BadRequestError('Only superadmin can delete users from a team');
  // }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError("You should create profile first");
  } else {
    const team: TeamDoc = await Team.findById(req.params.id);

    if (!team) {
      throw new BadRequestError("You should create team first");
    }
    const profileToDelete = await Profile.findOne({
      user_id: req.params.deleteuserid,
    });

    if (!profileToDelete) {
      throw new BadRequestError("There is no such a user");
    }

    if (
      team.members.filter((member) => member.toString() === profileToDelete.id)
        .length === 0
    ) {
      throw new BadRequestError("User is not a member of this team");
    }

    // Get the remove index
    const removeIndex = team.members
      .map((item) => item._id.toString())
      .indexOf(profileToDelete.id);

    // Splice out of array
    team.members.splice(removeIndex, 1);

    const removeTeamIndex = profileToDelete.joinedTeams
      .map((item) => item._id.toString())
      .indexOf(team.id);

    profileToDelete.joinedTeams.splice(removeIndex, 1);

    console.log(team);
    console.log(profileToDelete);

    // Save New team to DB
    await team.save((err) => {
      if (err) throw new BadRequestError("Could not save team to DB");
    });

    await profileToDelete.save((err) => {
      if (err) throw new BadRequestError("Could not save profile to DB");
    });

    // Publish a TeamUpdatyed event
    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      members: team.members,
      version: team.version,
      profile_id: profileToDelete.id,
    });

    // Publish a Profile Updated event
    new ProfileUpdatedPublisher(natsWrapper.client).publish({
      id: profileToDelete.id,
      handle: profileToDelete.handle,
      joinedTeams: profileToDelete.joinedTeams,
      version: profileToDelete.version,
      user_id: req.user.id,
    });

    return res.status(201).json({
      status: "success",
      data: {
        team,
      },
    });
  }
};

export { deleteUserFromTeam };

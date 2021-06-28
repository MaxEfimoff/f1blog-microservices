import { Request, Response } from "express";
import "express-async-errors";
import { NotFoundError, BadRequestError } from "@f1blog/common";
import { Team } from "../../../db/models/Team";
import { Profile } from "../../../db/models/Profile";

const fetchAllUsersInTeam = async (req: Request, res: Response) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    throw new BadRequestError("There is no team with this id");
  } else {
    const users = await Team.find({
      members: { $in: team.members.map((a) => a._id) },
    })
      .populate("user")
      .limit(10)
      .sort({
        createdAt: -1,
      });

    if (!users) {
      throw new NotFoundError();
    }

    return res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }
};

export { fetchAllUsersInTeam };

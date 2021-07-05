import { Request, Response } from "express";
import "express-async-errors";
import { NotFoundError, BadRequestError } from "@f1blog/common";
import { Profile } from "../../../db/models/Profile";
import { Team } from "../../../db/models/Team";

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchMyTeams = async (req: UserRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id }).populate(
    "team"
  );

  if (!profile) {
    throw new BadRequestError("You should create profile first");
  } else {
    const myTeams = profile.joinedTeams;

    if (!myTeams) {
      throw new NotFoundError();
    }

    return res.status(200).json({
      status: "success",
      results: myTeams.length,
      data: {
        myTeams,
      },
    });
  }
};

export { fetchMyTeams };

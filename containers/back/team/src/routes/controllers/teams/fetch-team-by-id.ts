import { Request, Response } from "express";
import { Team } from "../../../db/models/Team";
import { BadRequestError } from "@f1blog/common";

const fetchTeamById = async (req: Request, res: Response) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    throw new BadRequestError("There is no team with this id");
  }

  return res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
};

export { fetchTeamById };

import { Request, Response } from "express";
import { Team } from "../../../db/models/Team";
import { BadRequestError } from "@f1blog/common";

const fetchTeamByTitle = async (req: Request, res: Response) => {
  const team = await Team.findOne({ title: req.params.title });

  if (!team) {
    throw new BadRequestError("There are no team with this title");
  }

  return res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
};

export { fetchTeamByTitle };

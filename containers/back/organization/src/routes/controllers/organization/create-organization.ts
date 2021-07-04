import { Request, Response } from "express";
import "express-async-errors";
import { BadRequestError, NotFoundError } from "@f1blog/common";
import { Profile } from "../../../db/models/Profile";
import { Organization } from "../../../db/models/Organization";

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const createOrganization = async (req: UserRequest, res: Response) => {
  let { title, website } = req.body;

  const { user } = req;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError("You should create profile first");
  } else {
    const organizations = await Organization.find();

    if (organizations[0]) {
      throw new BadRequestError("You can create only one organization");
    }

    const newOrganization = Organization.build({
      title,
      website,
      profile: profile,
      createdAt: Date.now(),
    });

    console.log(newOrganization);

    // Save New Organization to DB
    await newOrganization.save((err) => {
      if (err) throw new BadRequestError("Could not save organization to DB");
    });

    return res.status(201).json({
      status: "success",
      data: {
        newOrganization,
      },
    });
  }
};

export { createOrganization };

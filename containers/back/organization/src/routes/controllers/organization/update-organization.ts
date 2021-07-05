import { Request, Response } from "express";
import "express-async-errors";
import { BadRequestError, NotFoundError } from "@f1blog/common";
import { Profile } from "../../../db/models/Profile";
import { Organization, OrganizationDoc } from "../../../db/models/Organization";

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

interface Body {
  title: string;
  website: string;
}

const updateOrganization = async (req: UserRequest, res: Response) => {
  let { title, website }: Body = req.body;

  const { user } = req;
  const orgId = req.params.id;

  if (!user) {
    throw new NotFoundError();
  }

  const profile = await Profile.findOne({ user_id: req.user.id });

  if (!profile) {
    throw new BadRequestError("You should create profile first");
  } else {
    const organization: OrganizationDoc = await Organization.findOne({
      _id: orgId,
    });

    if (!organization) {
      throw new BadRequestError("You should create organization first");
    }

    if (organization.profile.toString() !== profile._id.toString()) {
      throw new BadRequestError("You can not update this organization");
    }

    organization.title = title;
    organization.website = website;
    organization.updatedAt = Date.now();

    console.log(organization);

    // Save New organization to DB
    await organization.save((err) => {
      if (err) throw new BadRequestError("Could not save organization to DB");
    });

    return res.status(201).json({
      status: "success",
      data: {
        organization,
      },
    });
  }
};

export { updateOrganization };

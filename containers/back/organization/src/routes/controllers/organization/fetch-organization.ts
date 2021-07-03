import { Request, Response } from "express";
import "express-async-errors";
import { NotFoundError } from "@f1blog/common";
import { Organization } from "../../../db/models/Organization";

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const fetchOrganization = async (req: UserRequest, res: Response) => {
  const organization = await Organization.find();

  if (!organization) {
    throw new NotFoundError();
  }

  return res.status(200).json({
    status: "success",
    data: {
      organization,
    },
  });
};

export { fetchOrganization };

import { Request, Response, NextFunction } from 'express';
import { clearHash } from '../services/cache';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    iat: number;
    exp: number;
  };
}

const deleteHash = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  await next();

  clearHash(req.user.id.toString());
  clearHash('all');
};

export { deleteHash };

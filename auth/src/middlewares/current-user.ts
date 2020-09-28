import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTRequest extends Request {
  headers: {
    authorization: string;
  };

  user?: UserPayload;
}

interface UserPayload {
  id: string;
  name: string;
  iat: number;
  exp: number;
}

const currentUser = (req: JWTRequest, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next();
  }

  try {
    const jwtIncoming = req.headers.authorization.slice(7, 200);
    const payload = jwt.verify(jwtIncoming, process.env.JWT_KEY) as UserPayload;
    req.user = payload;
  } catch (err) {}

  next();
};

export { currentUser };

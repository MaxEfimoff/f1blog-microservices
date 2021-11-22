import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  name: string;
  role: string;
}

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

interface UserRequest extends Request {
  authorization: any;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  async use(req: UserRequest, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
      return next();
    }

    try {
      const bearer = bearerHeader.split(' ');
      const token = bearer[1];
      const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;

      req.user = payload;
    } catch (err) {
      throw new Error(err);
    }

    next();
  }
}

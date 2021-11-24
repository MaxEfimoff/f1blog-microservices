import { Request, Response } from 'express';
import 'express-async-errors';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { pool } from '../../../pool';
import { TokenService } from '../../service/token-service';

const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await TokenService.removeToken(refreshToken);
    res.clearCookie('refreshToken');

    return res.status(200).json({
      status: 'success',
      data: {
        token: 'Bearer ' + token,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export { logout };

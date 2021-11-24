import { Request, Response } from 'express';
import 'express-async-errors';
import { TokenService } from '../../service/token-service';

const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    const { newRefreshToken, newAuthToken } = await TokenService.refreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        token: 'Bearer ' + newAuthToken,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export { refresh };

import { Request, Response } from 'express';
import 'express-async-errors';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { pool } from '../../../pool';
import { TokenService } from '../../service/token-service';

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user1 = await pool.query(
      `
    SELECT * FROM userroles
    JOIN roles ON roles.id = userroles.role_id
    JOIN users ON users.id = userroles.user_id
    WHERE email = $1
  `,
      [email],
    );

    const foundUser = user1.rows[0];
    console.log('USER FROM PG ', user1.rows[0]);

    if (foundUser) {
      if (foundUser.active === false) {
        throw new BadRequestError('You should activate your account first');
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);

      if (isMatch) {
        // User Matched, create jsonwebtoken payload
        const payload = {
          id: foundUser.id,
          name: foundUser.name,
          role: foundUser.role,
        };

        const refreshToken = jsonwebtoken.sign(payload, process.env.JWT_REFRESH_KEY!, {
          expiresIn: '30d',
        });
        // Save refresh token to the DB
        TokenService.saveRefreshToken(foundUser.id, refreshToken);
        res.cookie('refreshToken', refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        // Sign the jsonwebtoken token
        jsonwebtoken.sign(payload, process.env.JWT_KEY!, { expiresIn: 604800 }, (err, token) => {
          res.status(200).json({
            status: 'success',
            data: {
              token: 'Bearer ' + token,
            },
          });
        });
      } else {
        throw new BadRequestError('Incorrect password');
      }
    } else {
      throw new NotFoundError();
    }
  } catch (error) {
    throw new Error(error);
  }
};

export { login };

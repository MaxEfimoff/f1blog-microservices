import { BadRequestError, NotAuthorizedError, NotFoundError } from '@f1blog/common';
import jsonwebtoken from 'jsonwebtoken';
import { pool } from '../../pool';

export class TokenService {
  static async saveRefreshToken(user_id: string, newRefreshToken: string) {
    const refreshToken = await pool.query(
      `
      SELECT * FROM refreshtoken
      WHERE user_id = $1
    `,
      [user_id],
    );
    console.log('newRefreshToken', newRefreshToken);
    console.log('user_id', user_id);

    const foundRefreshToken = refreshToken.rows[0];

    if (foundRefreshToken) {
      const res = await pool.query(
        `
          UPDATE refreshtoken 
          SET token = $1
          WHERE user_id = $2;
        `,
        [newRefreshToken, user_id],
      );

      return newRefreshToken;
    } else {
      const newToken = await pool.query(
        `
        INSERT INTO refreshtoken (token, user_id) 
        VALUES ($1, $2) RETURNING *;
      `,
        [newRefreshToken, user_id],
      );

      console.log('HASH ROWS: ', newToken);
      return newRefreshToken;
    }
  }

  static async removeToken(token: string) {
    await pool.query('DELETE FROM refreshtoken WHERE token = $1 RETURNING *;', [token]);
    return;
  }

  static async findToken(token: string) {
    const tokenFromDB = await pool.query('SELECT * FROM refreshtoken WHERE token = $1;', [token]);
    return tokenFromDB;
  }

  static async refreshToken(token: string) {
    if (!token) {
      throw new Error('Token does not exist');
    }

    const userData = jsonwebtoken.verify(token, process.env.JWT_REFRESH_KEY!);
    const tokenFromDB = await TokenService.findToken(token);

    if (!userData || !tokenFromDB) {
      throw new NotAuthorizedError();
    }

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [(userData as any).id!]);

    const newRefreshToken = jsonwebtoken.sign(user.rows[0], process.env.JWT_REFRESH_KEY!, {
      expiresIn: '30d',
    });

    console.log('jsonwebtoken', newRefreshToken);
    // Save refresh token to the DB
    TokenService.saveRefreshToken(user.rows[0].id, newRefreshToken);
    const newAuthToken = jsonwebtoken.sign(user.rows[0], process.env.JWT_KEY!, {
      expiresIn: 604800,
    });

    console.log('newRefreshToken', newRefreshToken);

    console.log('newAuthToken', newAuthToken);
    return { newRefreshToken, newAuthToken };
  }

  static vaidateAccessToken(token: string) {
    try {
      const userData = jsonwebtoken.verify(token, process.env.JWT_KEY!);

      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static validateRefreshToken(token: string) {
    try {
      const userData = jsonwebtoken.verify(token, process.env.JWT_REFRESH_KEY!);
      console.log('USERDATA', userData);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

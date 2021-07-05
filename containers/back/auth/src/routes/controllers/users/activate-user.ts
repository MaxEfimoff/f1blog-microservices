import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const activate = async (req: Request, res: Response) => {
  const hash = req.params.hash;

  const confirmationHash = await pool.query(`
    SELECT * FROM confirmationhash 
    WHERE hash = $1;
  `, [hash]);

  const user = confirmationHash.rows[0];

  if (user) {
    const foundUser = await pool.query(`
      SELECT * FROM confirmationhash 
      JOIN users ON users.id = confirmationhash.user_id
      WHERE user_id = $1 ;
    `, [user.id]);

    if (foundUser.rows[0]) {
      await pool.query(`
        UPDATE users 
        SET active = $1
        WHERE id = $2;
      `, [true, user.id]);

      const updatedUserRequest = await pool.query(`
        SELECT * FROM users 
        WHERE id = $1;
      `, [user.id]);

      const updatedUser = updatedUserRequest.rows[0];

      await pool.query('DELETE FROM confirmationhash WHERE hash = $1 RETURNING *;', [hash]);

      return res.status(200).json({
        status: 'success',
        data: {
          updatedUser,
        },
      });
    }
  } else {
    throw new BadRequestError('Control string is not found');
  }
};

export { activate };

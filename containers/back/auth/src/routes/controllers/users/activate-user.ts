import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const activate = async (req: Request, res: Response) => {
  const hash = req.params.hash;

  console.log('HASH', hash)

  const confirmationHash = await pool.query(`
    SELECT * FROM confirmationhash 
    WHERE hash = $1;
  `, [hash]);
  const user = confirmationHash.rows[0];

  console.log('CONF HASH', user);

  if (user) {
    const foundUser = await pool.query(`
      SELECT * FROM confirmationhash 
      JOIN users ON users.id = confirmationhash.user_id
      WHERE user_id = $1 ;
    `, [user.id]);

    console.log('FOUND USER', foundUser.rows[0])

    if (foundUser.rows[0]) {
      const updatedUserArray = await pool.query(`
        UPDATE users 
        SET active = $1
        WHERE id = $2;
      `, [true, user.id]);

      const updatedUser = foundUser.rows[0];

      console.log('UPDATED UESR', updatedUser)

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

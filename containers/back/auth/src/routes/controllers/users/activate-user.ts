import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const activate = async (req: Request, res: Response) => {
  const hash = req.params.hash;

  const confirmationHash = await pool.query(`
    SELECT * FROM confirmationhash 
    WHERE hash = ${hash};
  `);

  console.log('CONF HASH', confirmationHash.rows[0]);

  if (confirmationHash.rows[0]) {
    const foundUser = await pool.query(`
      SELECT * FROM confirmationhash 
      JOIN users ON users.id = confirmationhash.user_id
      WHERE user_id = ${hash} ;
    `);

    console.log('FOUND USER', foundUser.rows[0])

    if (foundUser) {
      const updatedUserArray = await pool.query('UPDATE users SET active = $1 RETURNING *;', [true]);

      const updatedUser = updatedUserArray.rows[0];

      console.log('UPDATED UESR', updatedUser)

      await pool.query('DELETE FROM confirmationhash WHERE hash = $1 RETURNING *;', hash);

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

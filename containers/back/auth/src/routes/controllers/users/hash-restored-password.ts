import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const hashResetPassword = async (req: Request, res: Response) => {
  let { password } = req.body;
  const { hash } = req.params;

  if (!password) {
    throw new BadRequestError('You should provide a password');
  }

  if (!hash) {
    throw new BadRequestError('Hash is not valid');
  }

  const resetPasswordHash = await pool.query(
    `
      SELECT * FROM resetpasswordhash
      WHERE hash = $1;
    `,
    [hash],
  );

  if (!resetPasswordHash.rows[0]) {
    throw new BadRequestError('Reset hash not found');
  } else {
    let user = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1
    `,
      [resetPasswordHash.rows[0].user_id],
    );

    console.log('USER', user.rows[0]);

    user = user.rows[0];

    if (!user) {
      throw new BadRequestError('Could not find the user');
    } else {
      // Encrypt the password
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, passwordHash) => {
          if (err) throw new BadRequestError('Could not hash the password');
          console.log('PASSWORD changed', passwordHash);

          await pool.query(
            `
            DELETE FROM resetpasswordhash
            WHERE hash = $1
            RETURNING *;
          `,
            [hash],
          );

          // Save the encrypted password in user table
          await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE id = $2;
          `,
            [passwordHash, user.id],
          );
        });
      });

      const updatedUser = await pool.query(
        `
        SELECT * FROM users
        WHERE id = $1
      `,
        [user.id],
      );

      const newData = updatedUser.rows[0];
      console.log('UPDATED USER11', newData);

      return res.status(201).json({
        status: 'success',
        data: {
          newData,
        },
      });
    }
  }
};

export { hashResetPassword };

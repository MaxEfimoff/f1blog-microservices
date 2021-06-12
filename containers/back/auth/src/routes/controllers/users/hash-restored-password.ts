import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';
import { isConditionalExpression } from 'typescript';

const hashResetPassword = async (req: Request, res: Response) => {
  let { password } = req.body;
  const { hash } = req.params;

  const resetPasswordHash = await pool.query(`
      SELECT * FROM resetpasswordhash
      WHERE hash = $1;
    `, [hash]);

  console.log('RESET PASSWORD', resetPasswordHash.rows[0]);

  if (!resetPasswordHash.rows[0]) {
    throw new BadRequestError('Reset hash not found');
  } else {
    let user = await pool.query(`
      SELECT * FROM users
      WHERE id = $1
    `, [resetPasswordHash.rows[0].user_id]);

    console.log('USER', user.rows[0])

    user = user.rows[0];

    if (!user) {
      throw new BadRequestError('Could not find the user');
    } else {
      // Encrypt the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, passwordHash) => {
          if (err) throw new BadRequestError('Could not hash the password');

          // Save the encrypted password in user table
          pool.query(`
            UPDATE users
            SET password = $1
            WHERE id = $2;
          `, [passwordHash, user.id]);

          pool.query(`
            DELETE FROM resetpasswordhash
            WHERE hash = $1
            RETURNING *;
          `, [hash]);

          const allHashes = await pool.query('SELECT * FROM resetpasswordhash');
          console.log('ALL HASHES', allHashes.rows[0])
        });
      });

      return res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  }
};

export { hashResetPassword };

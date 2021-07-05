import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { sendResetPasswordEmail } from '../../helpers/sendResetPasswordEmail';
import { pool } from '../../../pool';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
  };
}

const restorePasswordRequest = async (req: UserRequest, res: Response) => {
  let { email } = req.body;

  // Check if email already exists
  const user = await pool.query(`
    SELECT * FROM users WHERE email = $1;
  `, [email]);

  const foundUser = user.rows[0];

  console.log('USER FROM PG ', foundUser);

  if (!foundUser) {
    throw new BadRequestError('There is no such a user');
  } else {
    // Encrypt the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(foundUser.email, salt, async (err, hash) => {
        if (err) throw new BadRequestError('Could not hash the password');

        hash = hash.replace(/\//g, '.');

        // Create resetpasswordhash hash
        const createdHash = await pool.query(`
          INSERT INTO resetpasswordhash (hash, user_id)
          VALUES ($1, $2)
          RETURNING *;
        `, [hash, foundUser.id]);

        // Send a letter with the confirmation hash
        sendResetPasswordEmail(
          { toUser: foundUser, hash: hash },
          (err: any) => {
            if (err)
              throw new BadRequestError('Could not send confirmation hash');

            return res.status(201).json({
              status: 'success',
              data: {
                foundUser,
              },
            });
          }
        );
      });
    });
  }
};

export { restorePasswordRequest };

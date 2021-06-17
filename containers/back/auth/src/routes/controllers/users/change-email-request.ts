import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { sendChangeEmail } from '../../helpers/sendChangeEmail';
import { pool } from '../../../pool';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const changeEmailRequest = async (req: UserRequest, res: Response) => {
  const foundUser = req.user;

  if (!foundUser) {
    throw new NotFoundError();
  }

  console.log('USER', foundUser);

  // Check if email already exists
  const users = await pool.query(`
    SELECT * FROM users WHERE id = $1;
  `, [foundUser.id]);

  const user = users.rows[0];

  console.log('USER FROM PG ', user);

  if (!user) {
    throw new BadRequestError('There is no such a user');
  } else {
    // Encrypt the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.email, salt, async (err, hash) => {
        if (err) throw new BadRequestError('Could not hash the email');

        hash = hash.replace(/\//g, '.');

        // Create resetpasswordhash hash
        const createdHash = await pool.query(`
          INSERT INTO changeemailhash (hash, user_id)
          VALUES ($1, $2)
          RETURNING *;
        `, [hash, user.id]);

        // Send a letter with the confirmation hash
        sendChangeEmail(
          { toUser: user, hash: hash },
          (err: any) => {
            if (err)
              throw new BadRequestError('Could not send confirmation hash');

            return res.status(201).json({
              status: 'success',
              data: {
                user,
              },
            });
          }
        );
      });
    });
  }
};

export { changeEmailRequest };

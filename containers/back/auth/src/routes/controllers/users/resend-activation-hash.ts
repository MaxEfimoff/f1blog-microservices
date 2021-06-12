import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { sendConfirmationEmail } from '../../helpers/sendConfirmationEmail';
import { pool } from '../../../pool';

const resendActivationHash = async (req: Request, res: Response) => {
  let { email } = req.body;

  // Check if email already exists
  const user = await pool.query(`
    SELECT * FROM users WHERE email = $1;
  `, [email]);

  const foundUser = user.rows[0];

  console.log('FOUND USER', foundUser);

  if (!foundUser) {
    throw new BadRequestError('There is no such a user');
  } else {
    const foundHash = await pool.query(`
      SELECT * FROM confirmationhash 
      JOIN users ON users.id = confirmationhash.user_id
      WHERE user_id = $1;
    `, [foundUser.id]);

    const createdHash = foundHash.rows[0];

    console.log('CREATED HASH', createdHash);

    if (!createdHash) {
      throw new BadRequestError('There is no confirmation hash for this user, please reset you password');
    } else {
      const hashId = createdHash.id;

      sendConfirmationEmail(
        { toUser: foundUser, hash: hashId },
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
    }
  }
};

export { resendActivationHash };

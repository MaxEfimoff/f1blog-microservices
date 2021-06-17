import { Request, Response } from 'express';
import { UserUpdatedPublisher } from '../../../events/publishers/user-updated-publisher';
import { natsWrapper } from '../../../nats-wrapper';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const hashChangeEmail = async (req: Request, res: Response) => {
  let { email } = req.body;
  const { hash } = req.params;

  if (!email) {
    throw new BadRequestError('You should provide an email');
  }

  const foundEmail = await pool.query(`
    SELECT * FROM users
    WHERE email = $1
  `, [email]);

  if (foundEmail.rows[0]) {
    throw new BadRequestError('Email in use');
  }

  const changeEmailHash = await pool.query(`
    SELECT * FROM changeemailhash
    WHERE hash = $1;
  `, [hash]);

  console.log('RESET EMAIL', changeEmailHash.rows[0]);

  if (!changeEmailHash.rows[0]) {
    throw new BadRequestError('Reset hash not found');
  } else {
    let user = await pool.query(`
      SELECT * FROM users
      WHERE id = $1
    `, [changeEmailHash.rows[0].user_id]);

    console.log('USER', user.rows[0])

    user = user.rows[0];

    if (!user) {
      throw new BadRequestError('Could not find the user');
    } else {
      user.version = user.version + 1;

      // Save the email in user table
      await pool.query(`
        UPDATE users
        SET email = $1, version = $3
        WHERE id = $2;
      `, [email, user.id, user.version]);

      // Publish update user event
      new UserUpdatedPublisher(natsWrapper.client).publish({
        id: user.id,
        name: user.name,
        email: email,
        version: user.version,
      });

      await pool.query(`
        DELETE FROM changeemailhash
        WHERE hash = $1
        RETURNING *;
      `, [hash]);

      return res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  }
};

export { hashChangeEmail };
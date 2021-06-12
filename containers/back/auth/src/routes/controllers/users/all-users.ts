import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const allUsers = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM users;');

  console.log('SQL USERS: ', rows);

  if (!rows) {
    throw new BadRequestError('There are no active users');
  }

  return res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      rows,
    },
  });
};

export { allUsers };

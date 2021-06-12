import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const allResetPasswordHashes = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM resetpasswordhash;');

  console.log('SQL resetpasswordhashes: ', rows);

  if (!rows) {
    throw new BadRequestError('There are no active resetpasswordhashes');
  }

  return res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      rows,
    },
  });
};

export { allResetPasswordHashes };

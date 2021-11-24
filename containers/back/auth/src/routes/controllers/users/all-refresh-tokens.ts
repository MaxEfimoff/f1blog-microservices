import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const allRefreshTokens = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM refreshtoken;');

  console.log('SQL refreshtokenes: ', rows);

  if (!rows) {
    throw new BadRequestError('There are no active refreshtokenes');
  }

  return res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      rows,
    },
  });
};

export { allRefreshTokens };

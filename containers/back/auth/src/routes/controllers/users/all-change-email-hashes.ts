import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const allChangeEmailHashes = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM changeemailhash;');

  console.log('SQL changeemailhashes: ', rows);

  if (!rows) {
    throw new BadRequestError('There are no active change email hashes');
  }

  return res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      rows,
    },
  });
};

export { allChangeEmailHashes };

import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const allConfirmationHashes = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM confirmationhash;');

  console.log('SQL confirmationhashes: ', rows);

  if (!rows) {
    throw new BadRequestError('There are no active confirmationhashes');
  }

  return res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      rows,
    },
  });
};

export { allConfirmationHashes };

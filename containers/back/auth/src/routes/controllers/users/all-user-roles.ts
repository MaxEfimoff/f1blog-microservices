import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const allUserRoles = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM roles;');

  console.log('SQL Roles: ', rows);

  if (!rows) {
    throw new BadRequestError('There are no user roles');
  }

  return res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      rows,
    },
  });
};

export { allUserRoles };

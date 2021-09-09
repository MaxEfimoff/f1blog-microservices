import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const createUserRole = async (req: Request, res: Response) => {
  let { role, description } = req.body;

  const user = await pool.query(
    `
    SELECT * FROM roles WHERE role = $1;
  `,
    [role]
  );

  if (user.rows[0]) {
    throw new BadRequestError('This role already exists');
  } else {
    const { rows } = await pool.query(
      `
      INSERT INTO roles (role, description) 
      VALUES ($1, $2) 
      RETURNING *;
    `,
      [role, description]
    );

    const savedRole = {
      email: rows[0].role,
      name: rows[0].description,
    };

    console.log('Created role ', savedRole);

    return res.status(201).json({
      status: 'success',
      data: {
        savedRole,
      },
    });
  }
};

export { createUserRole };

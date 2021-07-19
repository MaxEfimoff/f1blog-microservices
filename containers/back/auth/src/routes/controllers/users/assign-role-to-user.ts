import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError, NotFoundError } from '@f1blog/common';
import { pool } from '../../../pool';

const assignRoleToUser = async (req: Request, res: Response) => {
  const { id, role } = req.params;

  const user = await pool.query(
    `
    SELECT * FROM users 
    WHERE id = $1;
  `,
    [id]
  );

  const userRole = await pool.query(
    `
    SELECT * FROM roles 
    WHERE role = $1;
  `,
    [role]
  );

  const roleId = userRole.rows[0].id;

  if (user && userRole) {
    const foundUser = await pool.query(
      `
      SELECT * FROM userroles
      JOIN roles ON roles.id = userroles.role_id
      JOIN users ON users.id = userroles.user_id
      WHERE user_id = $1
    `,
      [id]
    );

    if (foundUser.rows[0].role === role) {
      throw new BadRequestError('This role was already assigned to this user');
    }

    await pool.query(
      `
        UPDATE userroles 
        SET role_id = $1
        WHERE user_id = $2;
      `,
      [roleId, id]
    );

    const updatedUserRequest = await pool.query(
      `
        SELECT * FROM userroles 
        JOIN roles ON roles.id = userroles.role_id
        JOIN users ON users.id = userroles.user_id
        WHERE user_id = $1
      `,
      [id]
    );

    const updatedUser = updatedUserRequest.rows[0];

    return res.status(200).json({
      status: 'success',
      data: {
        updatedUser,
      },
    });
  } else {
    throw new NotFoundError();
  }
};

export { assignRoleToUser };

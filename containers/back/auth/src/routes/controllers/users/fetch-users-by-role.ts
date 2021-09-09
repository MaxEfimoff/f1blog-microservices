import { Request, Response } from 'express';
import 'express-async-errors';
import { BadRequestError } from '@f1blog/common';
import { pool } from '../../../pool';

const fetchUsersByUserrole = async (req: Request, res: Response) => {
  const { role } = req.params;

  const foundRole = await pool.query(
    `
    SELECT * FROM roles 
    WHERE role = $1;
  `,
    [role]
  );
  const userRole = foundRole.rows[0].id;

  const usersWithRole = await pool.query(
    `
    SELECT * FROM userroles
    JOIN roles ON roles.id = userroles.role_id
    JOIN users ON users.id = userroles.user_id
    WHERE role_id = $1
  `,
    [userRole]
  );

  const foundUsers = usersWithRole.rows;
  console.log(foundUsers);

  if (foundUsers) {
    return res.status(200).json({
      status: 'success',
      results: foundUsers.length,
      data: {
        foundUsers,
      },
    });
  } else {
    throw new BadRequestError('Users with this role not found');
  }
};

export { fetchUsersByUserrole };

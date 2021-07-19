import { Request, Response } from 'express';

interface UserRequest extends Request {
  user: {
    id: string;
    name: string;
    role: string;
    // active: string;
  };
}

const current = async (req: UserRequest, res: Response) => {
  return res.json({
    status: 'success',
    data: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
      // active: req.user.active,
    },
  });
};

export { current };

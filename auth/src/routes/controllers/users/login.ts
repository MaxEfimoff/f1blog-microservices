import { Request, Response } from 'express';
import 'express-async-errors';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { BadRequestError } from '../../../errors/bad-request-error';
import { User } from '../../../db/models/User';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (user.active === false) {
      throw new BadRequestError('You should activate your account first');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // User Matched, create jsonwebtoken payload
      const payload = {
        id: user.id,
        name: user.name,
      };

      // Sign the jsonwebtoken token
      jsonwebtoken.sign(
        payload,
        process.env.JWT_KEY!,
        { expiresIn: 604800 },
        (err, token) => {
          res.status(200).json({
            status: 'success',
            data: {
              token: 'Bearer ' + token,
            },
          });
        }
      );
    } else {
      throw new BadRequestError('Incorrect password');
    }
  } else {
    throw new BadRequestError('There is no such a user');
  }
};

export { login };

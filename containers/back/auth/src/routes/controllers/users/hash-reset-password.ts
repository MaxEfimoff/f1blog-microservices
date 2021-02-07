import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../../../db/models/User';
import { ResetPasswordHash } from '../../../db/models/ResetPasswordHash';
import { BadRequestError } from '@f1blog/common';

const hashResetPassword = async (req: Request, res: Response) => {
  let { password } = req.body;
  const { hash } = req.params;

  const resetPasswordHash = await ResetPasswordHash.findById(hash).populate(
    'User'
  );

  if (!resetPasswordHash) {
    throw new BadRequestError('Reset hash not found');
  } else {
    const user = await User.findById(resetPasswordHash.user);

    if (!user) {
      throw new BadRequestError('Could not find the user');
    } else {
      // Encrypt the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) throw new BadRequestError('Could not hash the password');

          // Save the encrypted password in user object
          user.password = hash;
          await user.save((err) => {
            if (err) throw new BadRequestError('Could not save user');
          });
        });
      });

      resetPasswordHash.remove();

      return res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  }
};

export { hashResetPassword };

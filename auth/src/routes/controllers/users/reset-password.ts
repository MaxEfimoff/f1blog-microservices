import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { User } from '../../../db/models/User';
import { ResetPasswordHash } from '../../../db/models/ResetPasswordHash';
import { sendResetPasswordEmail } from '../../helpers/sendResetPasswordEmail';

const resetPassword = async (req: Request, res: Response) => {
  let { email } = req.body;

  // Check if email already exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('There is no such a user');
  } else {
    // Encrypt the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        if (err) throw new BadRequestError('Could not hash the password');

        // Save the encrypted password in user object
        user.password = hash;
        await user.save();

        // Create confirmetion hash
        const createdHash = ResetPasswordHash.build({ user: user });

        // Save confirmation hash to DB
        await createdHash.save((err, createdHash) => {
          if (err)
            throw new BadRequestError('Could not save confirmation hash');

          // Send a letter with the confirmation hash
          sendResetPasswordEmail(
            { toUser: user, hash: createdHash.id },
            (err: any) => {
              if (err)
                throw new BadRequestError('Could not send confirmation hash');

              return res.status(201).json({
                status: 'success',
                data: {
                  user,
                },
              });
            }
          );
        });
      });
    });
  }
};

export { resetPassword };

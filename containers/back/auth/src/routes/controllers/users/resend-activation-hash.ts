import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { BadRequestError } from '@f1blog/common';
import { User } from '../../../db/models/User';
import { ConfirmationHash } from '../../../db/models/ConfirmationHash';
import { sendConfirmationEmail } from '../../helpers/sendConfirmationEmail';

const resendActivationHash = async (req: Request, res: Response) => {
  let { email } = req.body;

  // Check if email already exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('There is no such a user');
  } else {
    const createdHash = ConfirmationHash.findOne({ user: user });

    if (!createdHash) {
      throw new BadRequestError('There is no confirmation hash for this user, please reset you password');
    } else {
      const hashId = (await createdHash)._id;
      
      sendConfirmationEmail(
        { toUser: user, hash: hashId},
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
    }
  }
};

export { resendActivationHash };

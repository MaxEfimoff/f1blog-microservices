import { Request, Response } from 'express';
import 'express-async-errors';
import { User } from '../../../db/models/User';
import { ConfirmationHash } from '../../../db/models/ConfirmationHash';
import { BadRequestError } from '../../../errors/bad-request-error';

const activate = async (req: Request, res: Response) => {
  const hash = req.params.hash;

  const confirmationHash = await ConfirmationHash.findById(hash);

  if (confirmationHash) {
    await ConfirmationHash.findById(hash)
      .populate('user')
      .exec(async (err: any, foundHash: any) => {
        if (err) throw new BadRequestError('Could not find user');

        await User.findByIdAndUpdate(
          foundHash.user.id,
          { $set: { active: true } },
          { new: true },
          (err, updatedUser) => {
            if (err) throw new BadRequestError('Could not activate user');

            foundHash.remove(() => {});
            return res.status(200).json({
              status: 'success',
              data: {
                updatedUser,
              },
            });
          }
        );
      });
  } else {
    throw new BadRequestError('Control string is not found');
  }
};

export { activate };

import { Request, Response } from 'express';
import 'express-async-errors';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../../../errors/bad-request-error';
import { sendConfirmationEmail } from '../../helpers/sendConfirmationEmail';
import { User } from '../../../db/models/User';
import { ConfirmationHash } from '../../../db/models/ConfirmationHash';

const register = async (req: Request, res: Response) => {
  let { name, email, password } = req.body;

  // Check if email already exists
  const user = await User.findOne({ email });

  if (user) {
    throw new BadRequestError('Email in use');
  } else {
    // Encrypt the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw new BadRequestError('Could not hash the password');

        // Save the encrypted password
        password = hash;

        // Create a New User
        const newUser = User.build({
          name,
          email,
          password,
        });

        // Save New user to DB
        const savedUser = await newUser.save();

        // Create confirmetion hash
        const createdHash = ConfirmationHash.build({ user: savedUser });

        // Save confirmation hash to DB
        await createdHash.save((err) => {
          if (err)
            throw new BadRequestError('Could not save confirmation hash');
        });

        // Send a letter with the confirmation hash
        sendConfirmationEmail(
          { toUser: savedUser, hash: createdHash.id },
          (err: any) => {
            if (err)
              throw new BadRequestError('Could not send confirmation hash');

            return res.status(201).json({
              status: 'success',
              data: {
                savedUser,
              },
            });
          }
        );
      });
    });
  }
};

export { register };

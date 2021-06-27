import { Request, Response } from "express";
import "express-async-errors";
import bcrypt from "bcrypt";
import { BadRequestError } from "@f1blog/common";
import { sendConfirmationEmail } from "../../helpers/sendConfirmationEmail";
import { UserCreatedPublisher } from "../../../events/publishers/user-created-publisher";
import { natsWrapper } from "../../../nats-wrapper";
import { pool } from "../../../pool";

const register = async (req: Request, res: Response) => {
  let { name, email, password, password2 } = req.body;

  if (password !== password2) {
    throw new BadRequestError("Passwords not match");
  }

  // Check if email already exists
  const user = await pool.query(
    `
    SELECT * FROM users WHERE email = $1;
  `,
    [email]
  );

  if (user.rows[0]) {
    throw new BadRequestError("Email in use");
  } else {
    // Encrypt the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw new BadRequestError("Could not hash the password");

        // Create confirmetion hash
        const serializedHash = hash.replace(/\//g, ".");
        console.log("SERIALIZED HASH", serializedHash);

        // Save New user to DB
        const { rows } = await pool.query(
          `
          INSERT INTO users (name, email, password) 
          VALUES ($1, $2, $3) 
          RETURNING *;
        `,
          [name, email, hash]
        );

        console.log("REGISTERED USER: ", rows[0]);

        // Publish an UserCreated event
        // new UserCreatedPublisher(natsWrapper.client).publish({
        //   id: newUser.id,
        //   name: newUser.name,
        //   email: newUser.email,
        //   version: newUser.version,
        // });

        const savedUser = {
          email: rows[0].email,
          name: rows[0].name,
        };

        new UserCreatedPublisher(natsWrapper.client).publish(rows[0]);

        // Save confirmation hash to DB
        const createdHash = await pool.query(
          `
          INSERT INTO confirmationhash (hash, user_id) 
          VALUES ($1, $2) RETURNING *;
        `,
          [serializedHash, rows[0].id]
        );

        console.log("HASH ROWS: ", createdHash.rows[0]);

        // Send a letter with the confirmation hash
        sendConfirmationEmail(
          { toUser: savedUser, hash: serializedHash },
          (err: any) => {
            if (err)
              throw new BadRequestError("Could not send confirmation hash");

            return res.status(201).json({
              status: "success",
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

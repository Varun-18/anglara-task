import { Request, Response } from 'express';
import { checkExistingUser } from './helpers';
import { User } from 'models';
import { generateHash } from 'utils';
import { RES_MESSAGES, STATUS_CODES } from 'constant';
import dotenv from 'dotenv';

dotenv.config();

const regsisterUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await checkExistingUser(email, false);

    if (existingUser) {
      res.status(400).json({ message: RES_MESSAGES.BAD_REQUEST });
      return;
    }

    const hashedPassword = await generateHash(password);

    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();

    res.status(STATUS_CODES.CREATED).json({
      message: 'User created successfully, please login to use API!',
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error || RES_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export { regsisterUser };

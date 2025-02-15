import { Request, Response } from 'express';
import { Secret, sign, SignOptions } from 'jsonwebtoken';

import { compareHash } from 'utils';

import { checkExistingUser } from './helpers';

import { RES_MESSAGES, STATUS_CODES } from 'constant';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await checkExistingUser(email, true);

    if (user === null) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: RES_MESSAGES.BAD_REQUEST });
      return;
    }

    const isMatch = await compareHash(password, user.password);

    if (!isMatch) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: RES_MESSAGES.UNAUTHORIZED });
      return;
    }

    const token = sign(
      { email: user.email },
      (process.env.JWT_SECRET || 'jwtsecret') as Secret,
      { expiresIn: process.env.JWT_EXPIRY || '1h' } as SignOptions
    );

    res
      .status(STATUS_CODES.OK)
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
        sameSite: 'none',
      })
      .json({ message: 'login successfully' });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error || RES_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

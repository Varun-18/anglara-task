import { AuthRequest } from 'declaration';
import { Response } from 'express';
import { checkExistingUser } from './helpers';
import { RES_MESSAGES, STATUS_CODES } from 'constant';

export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    const currentUser = await checkExistingUser(user.email, false);

    if (!currentUser) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: RES_MESSAGES.UNAUTHORIZED });
      return;
    }

    res.status(STATUS_CODES.OK).json({ user: currentUser });
  } catch (error) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: error || RES_MESSAGES.BAD_REQUEST });
  }
};

import { RES_MESSAGES, STATUS_CODES } from 'constant';
import { AuthRequest } from 'declaration';
import { Response } from 'express';
import { findCategory, updateCategoryStatus } from './helpers';
import { CategoryModel } from 'models';

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, status } = req.body;

    if (name && status) {
      res
        .status(STATUS_CODES.CONFLICT)
        .json({ message: 'You can update name or status one at a time' });
      return;
    }

    if (name && name !== '') {
      const categroyExits = await findCategory({ id, name });

      if (categroyExits) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: 'Such category already exists' });
        return;
      }

      await CategoryModel.findByIdAndUpdate(id, { name });

      res
        .status(STATUS_CODES.OK)
        .json({ message: 'Category name updated successfully!' });
      return;
    }

    if (status && status !== '') {
      await updateCategoryStatus({ id, status });
      res
        .status(STATUS_CODES.OK)
        .json({ message: 'Status updated successfully!' });
      return;
    }
  } catch (error) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: error || RES_MESSAGES.BAD_REQUEST });
  }
};

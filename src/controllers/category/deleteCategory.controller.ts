import { RES_MESSAGES, STATUS_CODES } from 'constant';
import { AuthRequest } from 'declaration';
import { Response } from 'express';
import { deleteCategoryHelper, findCategory } from './helpers';

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const categoryExists = await findCategory({ id });

    if (!categoryExists) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: 'Category does not exists' });
      return;
    }

    await deleteCategoryHelper({
      id,
      parentId: categoryExists.parent
        ? categoryExists.parent?.toString()
        : null,
    });

    res
      .status(STATUS_CODES.OK)
      .json({ message: 'Category deleted successfully!' });
  } catch (error) {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: error || RES_MESSAGES.BAD_REQUEST });
  }
};

import { AuthRequest } from 'declaration';
import { Response } from 'express';
import { addChildrenCategory, findCategory } from './helpers';
import { RES_MESSAGES, STATUS_CODES } from 'constant';
import { CategoryModel } from 'models';

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, parent } = req.body;

    let parentCategory;

    if (parent && parent !== '') {
      parentCategory = await findCategory({ id: parent });
      if (!parentCategory) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: RES_MESSAGES.BAD_REQUEST });
        return;
      }
    }

    const category = await findCategory({ name });

    if (category) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: RES_MESSAGES.BAD_REQUEST });
      return;
    }

    const newCategory = new CategoryModel({
      name,
      parent: parent !== '' ? parent : null,
    });

    await newCategory.save();

    const updatedParentCategory = await addChildrenCategory({
      childrenId: newCategory.id,
      parentId: parent,
    });

    res.status(STATUS_CODES.CREATED).json({
      message: RES_MESSAGES.CREATED,
      updatedParentCategory,
      newCategory,
    });
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error || RES_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

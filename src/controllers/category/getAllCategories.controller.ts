import { RES_MESSAGES, STATUS_CODES } from 'constant';
import { Request, Response } from 'express';
import { CategoryModel } from 'models';
import mongoose from 'mongoose';
import { CategoryType } from 'types';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const pipeline = [
      { $match: { parent: null } },
      {
        $graphLookup: {
          from: 'categories',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent',
          as: 'children',
          maxDepth: 9,
        },
      },
    ];

    const categories = await CategoryModel.aggregate(pipeline);

    const addChildren = (
      id: mongoose.Types.ObjectId | undefined,
      children: CategoryType[]
    ): CategoryType[] => {
      const directChildren = children?.filter(
        (child) => child?.parent?.toString() === id?.toString()
      );

      directChildren.forEach((child) => {
        if (child?.children) {
          const nestedChildren = addChildren(child._id, children);
          child.children = nestedChildren;
        }
      });

      return directChildren;
    };

    const formattedCategories = categories.map((category) => {
      return {
        ...category,
        children: addChildren(category._id, category.children),
      };
    });

    res.status(STATUS_CODES.OK).json({ categories: formattedCategories });
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error || RES_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

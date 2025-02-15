/* eslint-disable no-useless-catch */
import { CategoryModel } from 'models';
import { CategoryType } from 'types';

export const findCategory = async ({
  id,
  name,
}: {
  id?: string;
  name?: string;
}): Promise<CategoryType | null> => {
  try {
    if (!id && !name) return null;

    let category = null;

    category = await CategoryModel.findOne({
      ...(id ? { _id: id } : {}),
      ...(name ? { name } : {}),
    })
      .lean()
      .populate('children');

    return category;
  } catch (error) {
    throw error;
  }
};

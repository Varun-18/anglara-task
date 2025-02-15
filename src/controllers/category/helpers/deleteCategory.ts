/* eslint-disable no-useless-catch */
import { CategoryModel } from 'models';

export const deleteCategoryHelper = async ({
  id,
  parentId,
}: {
  id: string;
  parentId: string | null;
}) => {
  try {
    const directChildren = await CategoryModel.find({ parent: id }).lean();

    const directChildrenIds = directChildren.map((childCategory) =>
      childCategory._id.toString()
    );

    if (directChildrenIds.length > 0)
      await CategoryModel.updateMany(directChildrenIds, { parent: parentId });

    await CategoryModel.deleteOne({ _id: id });

    return;
  } catch (error) {
    throw error;
  }
};

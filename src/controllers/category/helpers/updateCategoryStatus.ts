/* eslint-disable no-useless-catch */
import { CategoryModel } from 'models';

export const updateCategoryStatus = async ({
  id,
  status,
}: {
  id: string;
  status: 'active' | 'inactive';
}) => {
  try {
    const ids: string[] = [];

    const getIdsToUpdate = async (id: string) => {
      ids.push(id);
      const rootElem = await CategoryModel.findOne({ _id: id }).lean();

      if (rootElem !== null) {
        if (rootElem.children.length > 0) {
          for (const element of rootElem.children) {
            await getIdsToUpdate(element.toString());
          }
        }
      }
    };

    await getIdsToUpdate(id);

    const updatedResult = await CategoryModel.updateMany(
      { _id: { $in: ids } },
      {
        status,
      }
    );

    return updatedResult;
  } catch (error) {
    throw error;
  }
};

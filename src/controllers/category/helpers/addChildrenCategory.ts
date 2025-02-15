import { CategoryModel } from 'models';

export const addChildrenCategory = async ({
  parentId,
  childrenId,
}: {
  parentId: string;
  childrenId: string;
}) => {
  try {
    const updatedParent = await CategoryModel.findByIdAndUpdate(
      parentId,
      {
        $push: { children: childrenId },
      },
      { new: true, runValidators: true }
    ).populate('children');

    return updatedParent;
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return null;
  }
};

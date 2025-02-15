import mongoose from 'mongoose';

/**
 * _id is added for category formatting like a tree structure
 * children: mongoose.Types.ObjectId[] | CategoryType[] : the CategoryType is also added for data formatting
 */
export type CategoryType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  parent: mongoose.Types.ObjectId | null;
  children: mongoose.Types.ObjectId[] | CategoryType[];
  status: 'active' | 'inactive';
};

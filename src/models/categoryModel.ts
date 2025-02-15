import mongoose, { Schema } from 'mongoose';

import { CategoryType } from 'types';

const categorySchema: Schema<CategoryType> = new mongoose.Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: false,
    default: null,
    index: true,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: false,
      default: [],
    },
  ],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

export const CategoryModel = mongoose.model<CategoryType>(
  'category',
  categorySchema
);

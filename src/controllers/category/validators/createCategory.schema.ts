import * as yup from 'yup';

export const createCategorySchema = yup.object({
  body: yup.object({
    name: yup.string().required('Category name is required'),
    parent: yup.string(),
  }),
});

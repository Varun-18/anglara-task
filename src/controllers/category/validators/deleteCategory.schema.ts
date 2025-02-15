import * as yup from 'yup';

export const deleteCategorySchema = yup.object({
  params: yup.object({
    id: yup.string().trim().required('ID is required to delete category!'),
  }),
});

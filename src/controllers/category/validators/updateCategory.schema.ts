import * as yup from 'yup';

export const updateCategorySchema = yup.object({
  body: yup.object({
    id: yup.string().trim().required('ID is required for name updation'),
    name: yup.string().trim(),
    status: yup
      .string()
      .oneOf(
        ['active', 'inactive'],
        'The status must be either active | inactive'
      ),
  }),
});

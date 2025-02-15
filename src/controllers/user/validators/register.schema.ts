import * as yup from 'yup';

export const registerUserSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('email is a required field'),
    name: yup.string().required('username is a required field'),
    password: yup.string().required('password is a required field'),
  }),
});

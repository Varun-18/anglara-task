import { Router } from 'express';

import { getUserDetails, loginUser, regsisterUser } from 'controllers';
import { authenticateUser, schemaValidator } from 'middlewares';

import {
  loginUserSchema,
  registerUserSchema,
} from 'controllers/user/validators';

const userRouter = Router();

userRouter.post(
  '/register',
  schemaValidator(registerUserSchema),
  regsisterUser
);

userRouter.post('/login', schemaValidator(loginUserSchema), loginUser);

/**
 * TODO : make a middleware that updates the refresh token
 */
userRouter.use(authenticateUser);

userRouter.get('/', getUserDetails);

export { userRouter };

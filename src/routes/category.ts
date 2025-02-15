import { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from 'controllers';

import { authenticateUser, schemaValidator } from 'middlewares';

import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from 'controllers/category/validators';

const categoryRouter = Router();

/**
 * All routes below this middleware will require authentication
 */
categoryRouter.use(authenticateUser);

categoryRouter.get('/', getAllCategories);
categoryRouter.post('/', schemaValidator(createCategorySchema), createCategory);
categoryRouter.put('/', schemaValidator(updateCategorySchema), updateCategory);

/**
 * 2 routes for delete
 * "/" : To prevent express from sending path not found to client
 * "/:id" : To actually delete the category with id
 */
categoryRouter.delete('/', schemaValidator(deleteCategorySchema));
categoryRouter.delete(
  '/:id',
  schemaValidator(deleteCategorySchema),
  deleteCategory
);

export { categoryRouter };

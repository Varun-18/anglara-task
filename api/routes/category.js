"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validators_1 = require("../controllers/category/validators");
const categoryRouter = (0, express_1.Router)();
exports.categoryRouter = categoryRouter;
/**
 * All routes below this middleware will require authentication
 */
categoryRouter.use(middlewares_1.authenticateUser);
categoryRouter.get('/', controllers_1.getAllCategories);
categoryRouter.post('/', (0, middlewares_1.schemaValidator)(validators_1.createCategorySchema), controllers_1.createCategory);
categoryRouter.put('/', (0, middlewares_1.schemaValidator)(validators_1.updateCategorySchema), controllers_1.updateCategory);
/**
 * 2 routes for delete
 * "/" : To prevent express from sending path not found to client
 * "/:id" : To actually delete the category with id
 */
categoryRouter.delete('/', (0, middlewares_1.schemaValidator)(validators_1.deleteCategorySchema));
categoryRouter.delete('/:id', (0, middlewares_1.schemaValidator)(validators_1.deleteCategorySchema), controllers_1.deleteCategory);

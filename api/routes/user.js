"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validators_1 = require("../controllers/user/validators");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post('/register', (0, middlewares_1.schemaValidator)(validators_1.registerUserSchema), controllers_1.regsisterUser);
userRouter.post('/login', (0, middlewares_1.schemaValidator)(validators_1.loginUserSchema), controllers_1.loginUser);
/**
 * TODO : make a middleware that updates the refresh token
 */
userRouter.use(middlewares_1.authenticateUser);
userRouter.get('/', controllers_1.getUserDetails);

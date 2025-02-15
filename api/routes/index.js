"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./user");
const category_1 = require("./category");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(200).render('home');
});
router.use('/user', user_1.userRouter);
router.use('/category', category_1.categoryRouter);
exports.default = router;

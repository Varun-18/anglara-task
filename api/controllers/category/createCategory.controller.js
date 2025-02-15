"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = void 0;
const helpers_1 = require("./helpers");
const constant_1 = require("../../constant");
const models_1 = require("../../models");
const createCategory = async (req, res) => {
    try {
        const { name, parent } = req.body;
        let parentCategory;
        if (parent && parent !== '') {
            parentCategory = await (0, helpers_1.findCategory)({ id: parent });
            if (!parentCategory) {
                res
                    .status(constant_1.STATUS_CODES.BAD_REQUEST)
                    .json({ message: constant_1.RES_MESSAGES.BAD_REQUEST });
                return;
            }
        }
        const category = await (0, helpers_1.findCategory)({ name });
        if (category) {
            res
                .status(constant_1.STATUS_CODES.BAD_REQUEST)
                .json({ message: constant_1.RES_MESSAGES.BAD_REQUEST });
            return;
        }
        const newCategory = new models_1.CategoryModel({
            name,
            parent: parent !== '' ? parent : null,
        });
        await newCategory.save();
        const updatedParentCategory = await (0, helpers_1.addChildrenCategory)({
            childrenId: newCategory.id,
            parentId: parent,
        });
        res.status(constant_1.STATUS_CODES.CREATED).json({
            message: constant_1.RES_MESSAGES.CREATED,
            updatedParentCategory,
            newCategory,
        });
    }
    catch (error) {
        res
            .status(constant_1.STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error || constant_1.RES_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.createCategory = createCategory;

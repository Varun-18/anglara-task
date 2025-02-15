"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = void 0;
const constant_1 = require("../../constant");
const helpers_1 = require("./helpers");
const models_1 = require("../../models");
const updateCategory = async (req, res) => {
    try {
        const { id, name, status } = req.body;
        if (name && status) {
            res
                .status(constant_1.STATUS_CODES.CONFLICT)
                .json({ message: 'You can update name or status one at a time' });
            return;
        }
        if (name && name !== '') {
            const categroyExits = await (0, helpers_1.findCategory)({ id, name });
            if (categroyExits) {
                res
                    .status(constant_1.STATUS_CODES.BAD_REQUEST)
                    .json({ message: 'Such category already exists' });
                return;
            }
            await models_1.CategoryModel.findByIdAndUpdate(id, { name });
            res
                .status(constant_1.STATUS_CODES.OK)
                .json({ message: 'Category name updated successfully!' });
            return;
        }
        if (status && status !== '') {
            await (0, helpers_1.updateCategoryStatus)({ id, status });
            res
                .status(constant_1.STATUS_CODES.OK)
                .json({ message: 'Status updated successfully!' });
            return;
        }
    }
    catch (error) {
        res
            .status(constant_1.STATUS_CODES.BAD_REQUEST)
            .json({ message: error || constant_1.RES_MESSAGES.BAD_REQUEST });
    }
};
exports.updateCategory = updateCategory;

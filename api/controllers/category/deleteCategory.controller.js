"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = void 0;
const constant_1 = require("../../constant");
const helpers_1 = require("./helpers");
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryExists = await (0, helpers_1.findCategory)({ id });
        if (!categoryExists) {
            res
                .status(constant_1.STATUS_CODES.BAD_REQUEST)
                .json({ message: 'Category does not exists' });
            return;
        }
        await (0, helpers_1.deleteCategoryHelper)({
            id,
            parentId: categoryExists.parent
                ? categoryExists.parent?.toString()
                : null,
        });
        res
            .status(constant_1.STATUS_CODES.OK)
            .json({ message: 'Category deleted successfully!' });
    }
    catch (error) {
        res
            .status(constant_1.STATUS_CODES.BAD_REQUEST)
            .json({ message: error || constant_1.RES_MESSAGES.BAD_REQUEST });
    }
};
exports.deleteCategory = deleteCategory;

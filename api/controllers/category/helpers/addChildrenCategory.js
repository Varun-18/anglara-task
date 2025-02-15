"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChildrenCategory = void 0;
const models_1 = require("../../../models");
const addChildrenCategory = async ({ parentId, childrenId, }) => {
    try {
        const updatedParent = await models_1.CategoryModel.findByIdAndUpdate(parentId, {
            $push: { children: childrenId },
        }, { new: true, runValidators: true }).populate('children');
        return updatedParent;
    }
    catch (error) {
        console.log('🚀 ~ error:', error);
        return null;
    }
};
exports.addChildrenCategory = addChildrenCategory;

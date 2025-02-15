"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryHelper = void 0;
/* eslint-disable no-useless-catch */
const models_1 = require("../../../models");
const deleteCategoryHelper = async ({ id, parentId, }) => {
    try {
        const directChildren = await models_1.CategoryModel.find({ parent: id }).lean();
        const directChildrenIds = directChildren.map((childCategory) => childCategory._id.toString());
        if (directChildrenIds.length > 0)
            await models_1.CategoryModel.updateMany(directChildrenIds, { parent: parentId });
        await models_1.CategoryModel.deleteOne({ _id: id });
        return;
    }
    catch (error) {
        throw error;
    }
};
exports.deleteCategoryHelper = deleteCategoryHelper;

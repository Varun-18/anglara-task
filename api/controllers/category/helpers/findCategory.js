"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCategory = void 0;
/* eslint-disable no-useless-catch */
const models_1 = require("../../../models");
const findCategory = async ({ id, name, }) => {
    try {
        if (!id && !name)
            return null;
        let category = null;
        category = await models_1.CategoryModel.findOne({
            ...(id ? { _id: id } : {}),
            ...(name ? { name } : {}),
        })
            .lean()
            .populate('children');
        return category;
    }
    catch (error) {
        throw error;
    }
};
exports.findCategory = findCategory;

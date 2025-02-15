"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryStatus = void 0;
/* eslint-disable no-useless-catch */
const models_1 = require("../../../models");
const updateCategoryStatus = async ({ id, status, }) => {
    try {
        const ids = [];
        const getIdsToUpdate = async (id) => {
            ids.push(id);
            const rootElem = await models_1.CategoryModel.findOne({ _id: id }).lean();
            if (rootElem !== null) {
                if (rootElem.children.length > 0) {
                    for (const element of rootElem.children) {
                        await getIdsToUpdate(element.toString());
                    }
                }
            }
        };
        await getIdsToUpdate(id);
        const updatedResult = await models_1.CategoryModel.updateMany({ _id: { $in: ids } }, {
            status,
        });
        return updatedResult;
    }
    catch (error) {
        throw error;
    }
};
exports.updateCategoryStatus = updateCategoryStatus;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = void 0;
const constant_1 = require("../../constant");
const models_1 = require("../../models");
const getAllCategories = async (req, res) => {
    try {
        const pipeline = [
            { $match: { parent: null } },
            {
                $graphLookup: {
                    from: 'categories',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent',
                    as: 'children',
                    maxDepth: 9,
                },
            },
        ];
        const categories = await models_1.CategoryModel.aggregate(pipeline);
        const addChildren = (id, children) => {
            const directChildren = children?.filter((child) => child?.parent?.toString() === id?.toString());
            directChildren.forEach((child) => {
                if (child?.children) {
                    const nestedChildren = addChildren(child._id, children);
                    child.children = nestedChildren;
                }
            });
            return directChildren;
        };
        const formattedCategories = categories.map((category) => {
            return {
                ...category,
                children: addChildren(category._id, category.children),
            };
        });
        res.status(constant_1.STATUS_CODES.OK).json({ categories: formattedCategories });
    }
    catch (error) {
        res
            .status(constant_1.STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error || constant_1.RES_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.getAllCategories = getAllCategories;

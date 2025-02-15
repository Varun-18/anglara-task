"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExistingUser = void 0;
const models_1 = require("../../../models");
const checkExistingUser = async (email, password) => {
    try {
        const existingUser = await models_1.User.findOne({ email })
            .select(password ? '+password' : '-password')
            .lean();
        if (existingUser)
            return existingUser;
        return null;
    }
    catch (error) {
        console.log('🚀 ~ error:', error);
        return null;
    }
};
exports.checkExistingUser = checkExistingUser;
